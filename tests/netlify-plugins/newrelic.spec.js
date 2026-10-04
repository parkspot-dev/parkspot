// @vitest-environment node
// The Netlify build plugin hands each build to New Relic: hidden source
// maps on before the build, uploaded and deleted after it, and a
// deployment marker once a production deploy is out. New Relic problems
// must never block a deploy, a source map must never be deployed, and
// the user API key must never show up in a log line.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import * as plugin from '../../netlify/plugins/newrelic/index.js';
import { NERDGRAPH_API } from '../../scripts/newrelic/change-tracking.js';
import { SOURCEMAP_API } from '../../scripts/newrelic/sourcemaps.js';

// Made-up values in the shape of server-side keys.
const USER_API_KEY = ['NRAK', '0123456789ABCDEFGHIJKLMNOPQ'].join('-');
const LICENSE_KEY = ['0123456789abcdef0123456789abcdef0123', 'NRAL'].join('');

const SHA = '0123456789abcdef0123456789abcdef01234567';
const DEPLOY_ID = '6650f1e2a1b2c3d4e5f60718';
const CHANGE_TRACKING_ID = '7d3a8a1e-1c4b-4a3f-9e1d-2b6c8f0a9e55';
const UPLOAD_URL = `${SOURCEMAP_API}/v2/applications/1589185089/sourcemaps`;

// Set explicitly, so the tests don't depend on .env.production.
const PRODUCTION = Object.freeze({
    NEW_RELIC_BROWSER_ENABLED: 'true',
    NEW_RELIC_ACCOUNT_ID: '7629005',
    NEW_RELIC_BROWSER_APPLICATION_ID: '1589185089',
    NEW_RELIC_BROWSER_LICENSE_KEY: 'NRBR-b5f8ce862e40dfb4cd2',
    NEW_RELIC_API_KEY: USER_API_KEY,
    CONTEXT: 'production',
    COMMIT_REF: SHA,
    URL: 'https://www.parkspot.in',
    DEPLOY_PRIME_URL: 'https://master--parkspot.netlify.app',
    DEPLOY_ID,
    DEPLOY_URL: `https://${DEPLOY_ID}--parkspot.netlify.app`,
});

const FILES = {
    'index.html': '<!doctype html>',
    'assets/app-a1b2c3d4.js': 'console.log(1)',
    'assets/app-a1b2c3d4.js.map': '{"version":3}',
    'assets/chunk-e5f6a7b8.js': 'console.log(2)',
    'assets/chunk-e5f6a7b8.js.map': '{"version":3}',
    'assets/app-c9d0e1f2.css': 'body{}',
    'assets/app-c9d0e1f2.css.map': '{"version":3}',
};

function writeFiles(dir, files) {
    for (const [name, content] of Object.entries(files)) {
        const file = path.join(dir, name);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, content);
    }
}

// The parts of Netlify's `utils` the plugin uses. Like the real ones,
// failBuild() and failPlugin() throw.
function makeUtils() {
    const fail = (message) => {
        throw new Error(message);
    };
    return {
        build: { failBuild: vi.fn(fail), failPlugin: vi.fn(fail) },
        status: { show: vi.fn() },
    };
}

// New Relic, answering with `uploadStatus` to source map uploads and
// with `nerdGraph` to the change tracking mutation.
function stubNewRelic({ uploadStatus = 201, nerdGraph } = {}) {
    const fetchMock = vi.fn(async (url) => {
        if (url === UPLOAD_URL)
            return new Response('{}', { status: uploadStatus });
        if (url === NERDGRAPH_API) {
            return (
                nerdGraph?.() ??
                Response.json({
                    data: {
                        changeTrackingCreateEvent: {
                            changeTrackingEvent: {
                                changeTrackingId: CHANGE_TRACKING_ID,
                            },
                            messages: [],
                        },
                    },
                })
            );
        }
        throw new TypeError(`unexpected request to ${url}`);
    });
    vi.stubGlobal('fetch', fetchMock);
    return fetchMock;
}

function callsTo(fetchMock, url) {
    return fetchMock.mock.calls.filter(([calledUrl]) => calledUrl === url);
}

describe('netlify/plugins/newrelic', () => {
    let publishDir;
    let logs;

    beforeEach(() => {
        publishDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nr-publish-'));
        writeFiles(publishDir, FILES);
        // Keep this machine's values out; Netlify sets these on its own
        // builds.
        for (const key of Object.keys(process.env)) {
            if (/^(?:NEW_RELIC_|CONTEXT$|COMMIT_REF$|URL$|DEPLOY_)/.test(key)) {
                vi.stubEnv(key, undefined);
            }
        }
        logs = [];
        for (const level of ['log', 'warn']) {
            vi.spyOn(console, level).mockImplementation((line) =>
                logs.push(`${level}: ${line}`),
            );
        }
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
        fs.rmSync(publishDir, { recursive: true, force: true });
    });

    function stubEnv(env) {
        for (const [key, value] of Object.entries(env)) {
            vi.stubEnv(key, value);
        }
    }

    function constants(overrides = {}) {
        return { PUBLISH_DIR: publishDir, IS_LOCAL: false, ...overrides };
    }

    function mapsLeft() {
        return fs
            .readdirSync(path.join(publishDir, 'assets'))
            .filter((name) => name.endsWith('.map'));
    }

    function expectNoKeyInLogs() {
        expect(logs.join('\n')).not.toContain(USER_API_KEY);
        expect(logs.join('\n')).not.toContain(LICENSE_KEY);
    }

    it('exports nothing but event handlers, as Netlify requires', () => {
        expect(Object.keys(plugin).sort()).toEqual([
            'onPostBuild',
            'onPreBuild',
            'onSuccess',
        ]);
        for (const handler of Object.values(plugin)) {
            expect(handler).toBeTypeOf('function');
        }
        const manifest = fs.readFileSync(
            new URL(
                '../../netlify/plugins/newrelic/manifest.yml',
                import.meta.url,
            ),
            'utf8',
        );
        expect(manifest).toMatch(/^name: parkspot-newrelic$/m);
    });

    describe('onPreBuild', () => {
        function preBuild(overrides) {
            const netlifyConfig = { build: { environment: {} } };
            plugin.onPreBuild({
                netlifyConfig,
                constants: constants(overrides),
            });
            return netlifyConfig.build.environment;
        }

        it('turns on hidden source maps for the build command', () => {
            stubEnv(PRODUCTION);
            expect(preBuild()).toEqual({ NEW_RELIC_SOURCEMAPS: 'true' });
            expect(logs).toEqual([
                'log: [newrelic] hidden source maps on, for ' +
                    'https://www.parkspot.in',
            ]);
        });

        it('leaves them off without a user API key', () => {
            stubEnv({ ...PRODUCTION, NEW_RELIC_API_KEY: '' });
            expect(preBuild()).toEqual({});
            expect(logs).toEqual([
                'log: [newrelic] NEW_RELIC_API_KEY is not set or the browser ' +
                    'agent is off: no source maps or deployment marker',
            ]);
        });

        it('leaves them off while the agent is off', () => {
            stubEnv({ ...PRODUCTION, NEW_RELIC_BROWSER_ENABLED: 'false' });
            expect(preBuild()).toEqual({});
        });

        it('leaves them off on a local build', () => {
            stubEnv(PRODUCTION);
            expect(preBuild({ IS_LOCAL: true })).toEqual({});
            expect(logs).toEqual([
                'log: [newrelic] local build: no source maps or deployment ' +
                    'marker',
            ]);
        });

        it('warns about a key in the wrong shape, without echoing it', () => {
            stubEnv({ ...PRODUCTION, NEW_RELIC_API_KEY: LICENSE_KEY });
            expect(preBuild()).toEqual({});
            expect(logs).toEqual([
                'warn: [newrelic] NEW_RELIC_API_KEY must be a user API key ' +
                    '(NRAK-...); license and browser keys cannot upload ' +
                    'source maps or record deployments: no source maps or ' +
                    'deployment marker',
            ]);
            expectNoKeyInLogs();
        });
    });

    describe('onPostBuild', () => {
        it('uploads the script maps, then deletes every map', async () => {
            stubEnv(PRODUCTION);
            const fetchMock = stubNewRelic();
            const utils = makeUtils();
            await plugin.onPostBuild({ constants: constants(), utils });

            const uploads = callsTo(fetchMock, UPLOAD_URL);
            expect(
                uploads
                    .map(([, init]) => init.body.get('javascriptUrl'))
                    .sort(),
            ).toEqual([
                'https://www.parkspot.in/assets/app-a1b2c3d4.js',
                'https://www.parkspot.in/assets/chunk-e5f6a7b8.js',
            ]);
            expect(uploads[0][1].body.get('buildCommit')).toBe(SHA);
            expect(mapsLeft()).toEqual([]);
            expect(
                fs.existsSync(path.join(publishDir, 'assets/app-a1b2c3d4.js')),
            ).toBe(true);
            expect(utils.status.show).toHaveBeenCalledWith({
                title: 'New Relic source maps',
                summary:
                    '2 of 2 source maps uploaded to New Relic, then removed ' +
                    'from the deploy',
            });
            expect(logs).toContain(
                'log: [newrelic] 2 source maps uploaded, 0 already there, ' +
                    'for https://www.parkspot.in',
            );
            expect(utils.build.failBuild).not.toHaveBeenCalled();
            expectNoKeyInLogs();
        });

        it('uploads for the deploy URL outside production', async () => {
            stubEnv({
                ...PRODUCTION,
                CONTEXT: 'deploy-preview',
                DEPLOY_PRIME_URL:
                    'https://deploy-preview-42--parkspot.netlify.app',
            });
            const fetchMock = stubNewRelic();
            await plugin.onPostBuild({
                constants: constants(),
                utils: makeUtils(),
            });
            const [[, init]] = callsTo(fetchMock, UPLOAD_URL);
            expect(init.body.get('javascriptUrl')).toMatch(
                /^https:\/\/deploy-preview-42--parkspot\.netlify\.app\/assets\//,
            );
        });

        it('reports failed uploads, and still deletes the maps', async () => {
            stubEnv(PRODUCTION);
            stubNewRelic({ uploadStatus: 403 });
            const utils = makeUtils();
            await plugin.onPostBuild({ constants: constants(), utils });

            expect(mapsLeft()).toEqual([]);
            expect(utils.status.show).toHaveBeenCalledWith({
                title: 'New Relic source maps',
                summary:
                    '0 of 2 source maps uploaded to New Relic, then removed ' +
                    'from the deploy',
                text: 'Not uploaded: 2 x New Relic answered 403',
            });
            expect(logs).toContain(
                'warn: [newrelic] source maps not uploaded: 2 x New Relic ' +
                    'answered 403',
            );
            expect(utils.build.failBuild).not.toHaveBeenCalled();
            expectNoKeyInLogs();
        });

        it('deletes maps nobody asked for, without uploading them', async () => {
            stubEnv({ ...PRODUCTION, NEW_RELIC_API_KEY: '' });
            const fetchMock = stubNewRelic();
            const utils = makeUtils();
            await plugin.onPostBuild({ constants: constants(), utils });

            expect(fetchMock).not.toHaveBeenCalled();
            expect(mapsLeft()).toEqual([]);
            expect(logs).toEqual([
                'warn: [newrelic] deleting 3 source maps that were not ' +
                    'asked for',
            ]);
            expect(utils.status.show).not.toHaveBeenCalled();
        });

        it('uploads nothing from a local build', async () => {
            stubEnv(PRODUCTION);
            const fetchMock = stubNewRelic();
            await plugin.onPostBuild({
                constants: constants({ IS_LOCAL: true }),
                utils: makeUtils(),
            });
            expect(fetchMock).not.toHaveBeenCalled();
            expect(mapsLeft()).toEqual([]);
        });

        it('uploads nothing with a config error', async () => {
            stubEnv({ ...PRODUCTION, URL: 'not an origin' });
            const fetchMock = stubNewRelic();
            await plugin.onPostBuild({
                constants: constants(),
                utils: makeUtils(),
            });
            expect(fetchMock).not.toHaveBeenCalled();
            expect(mapsLeft()).toEqual([]);
        });

        it('fails the build when a map cannot be deleted', async () => {
            stubEnv(PRODUCTION);
            stubNewRelic();
            writeFiles(publishDir, { 'assets/broken-d7e8f9a0.js': '' });
            fs.mkdirSync(
                path.join(publishDir, 'assets/broken-d7e8f9a0.js.map'),
            );
            const utils = makeUtils();
            await expect(
                plugin.onPostBuild({ constants: constants(), utils }),
            ).rejects.toThrow(
                '[newrelic] could not delete the source maps, so the build ' +
                    'was stopped before they could be deployed',
            );
            expect(utils.build.failBuild).toHaveBeenCalledWith(
                expect.any(String),
                { error: expect.any(Error) },
            );
            expect(utils.status.show).toHaveBeenCalledWith(
                expect.objectContaining({
                    text: 'Not uploaded: 1 x could not read it (EISDIR)',
                }),
            );
        });

        it('fails the build when it cannot look for maps', async () => {
            fs.rmSync(path.join(publishDir, 'assets'), { recursive: true });
            fs.writeFileSync(path.join(publishDir, 'assets'), '');
            const utils = makeUtils();
            await expect(
                plugin.onPostBuild({ constants: constants(), utils }),
            ).rejects.toThrow('[newrelic] could not look for source maps');
            expect(utils.build.failBuild).toHaveBeenCalledTimes(1);
        });

        it('does nothing when there are no maps', async () => {
            stubEnv(PRODUCTION);
            fs.rmSync(path.join(publishDir, 'assets'), { recursive: true });
            const fetchMock = stubNewRelic();
            const utils = makeUtils();
            await plugin.onPostBuild({ constants: constants(), utils });
            expect(fetchMock).not.toHaveBeenCalled();
            expect(utils.status.show).not.toHaveBeenCalled();
            expect(logs).toEqual([]);
        });

        it('warns when maps were asked for but none were written', async () => {
            stubEnv({ ...PRODUCTION, NEW_RELIC_SOURCEMAPS: 'true' });
            fs.rmSync(path.join(publishDir, 'assets'), { recursive: true });
            await plugin.onPostBuild({
                constants: constants(),
                utils: makeUtils(),
            });
            expect(logs).toEqual([
                'warn: [newrelic] source maps were asked for, but the build ' +
                    'wrote none: is newRelicBrowser() still in vite.config.js?',
            ]);
        });
    });

    describe('onSuccess', () => {
        it('records a deployment marker for a production deploy', async () => {
            stubEnv(PRODUCTION);
            const fetchMock = stubNewRelic();
            const utils = makeUtils();
            await plugin.onSuccess({ constants: constants(), utils });

            const [[, init]] = callsTo(fetchMock, NERDGRAPH_API);
            expect(init.headers['API-Key']).toBe(USER_API_KEY);
            const { query } = JSON.parse(init.body);
            expect(query).toContain(
                'deployment: { version: "0123456789ab", ' +
                    `commit: "${SHA}", ` +
                    `deepLink: "https://${DEPLOY_ID}--parkspot.netlify.app" }`,
            );
            expect(query).toContain(
                'entitySearch: { query: "id = \'NzYyOTAwNXxCUk9XU0VSfEFQ' +
                    'UExJQ0FUSU9OfDE1ODkxODUwODk\'" }',
            );
            expect(query).toContain(
                'description: "Netlify production deploy", ' +
                    `groupId: "${DEPLOY_ID}"`,
            );
            expect(logs).toEqual([
                'log: [newrelic] deployment marker for 0123456789ab: ' +
                    CHANGE_TRACKING_ID,
            ]);
            expect(utils.build.failPlugin).not.toHaveBeenCalled();
            expectNoKeyInLogs();
        });

        it('passes on what NerdGraph says about the marker', async () => {
            stubEnv(PRODUCTION);
            stubNewRelic({
                nerdGraph: () =>
                    Response.json({
                        data: {
                            changeTrackingCreateEvent: {
                                changeTrackingEvent: {
                                    changeTrackingId: CHANGE_TRACKING_ID,
                                },
                                messages: ['description was trimmed'],
                            },
                        },
                    }),
            });
            await plugin.onSuccess({
                constants: constants(),
                utils: makeUtils(),
            });
            expect(logs).toContain(
                'warn: [newrelic] NerdGraph: description was trimmed',
            );
        });

        it.each([
            ['a deploy preview', { CONTEXT: 'deploy-preview' }],
            ['a branch deploy', { CONTEXT: 'branch-deploy' }],
            ['a build without a commit', { COMMIT_REF: '' }],
            ['a build without a key', { NEW_RELIC_API_KEY: '' }],
        ])('records nothing for %s', async (_label, overrides) => {
            stubEnv({ ...PRODUCTION, ...overrides });
            const fetchMock = stubNewRelic();
            const utils = makeUtils();
            await plugin.onSuccess({ constants: constants(), utils });
            expect(fetchMock).not.toHaveBeenCalled();
            expect(utils.build.failPlugin).not.toHaveBeenCalled();
        });

        it('records nothing for a local build', async () => {
            stubEnv(PRODUCTION);
            const fetchMock = stubNewRelic();
            await plugin.onSuccess({
                constants: constants({ IS_LOCAL: true }),
                utils: makeUtils(),
            });
            expect(fetchMock).not.toHaveBeenCalled();
        });

        it('fails the plugin, not the deploy, when the marker fails', async () => {
            stubEnv(PRODUCTION);
            const fetchMock = stubNewRelic({
                nerdGraph: () => new Response('{}', { status: 500 }),
            });
            const utils = makeUtils();
            await expect(
                plugin.onSuccess({ constants: constants(), utils }),
            ).rejects.toThrow(
                '[newrelic] NerdGraph answered 500: no deployment marker for ' +
                    'this deploy (the deploy itself is fine)',
            );
            // No retry: it could record the deploy twice.
            expect(callsTo(fetchMock, NERDGRAPH_API)).toHaveLength(1);
            expect(utils.build.failPlugin).toHaveBeenCalledTimes(1);
            expect(utils.build.failBuild).not.toHaveBeenCalled();
        });

        it('fails the plugin on a config error, without echoing it', async () => {
            stubEnv({ ...PRODUCTION, NEW_RELIC_API_KEY: LICENSE_KEY });
            const fetchMock = stubNewRelic();
            const utils = makeUtils();
            const error = await plugin
                .onSuccess({ constants: constants(), utils })
                .catch((error) => error);
            expect(error.message).toMatch(
                /^\[newrelic\] NEW_RELIC_API_KEY must be a user API key .*: no source maps or deployment marker for this deploy$/,
            );
            expect(error.message).not.toContain(LICENSE_KEY);
            expect(fetchMock).not.toHaveBeenCalled();
            expect(utils.build.failBuild).not.toHaveBeenCalled();
        });
    });
});
