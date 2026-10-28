// @vitest-environment node
// The Vite plugin builds the New Relic Browser snippet from env vars and
// the vendored loader. Everything it emits is public, so it must refuse
// anything that could leak a secret or break out of the inline script,
// and it must fail the build rather than ship pages that silently report
// nothing.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';

import { OBFUSCATION_RULES } from '@/telemetry/sanitize.js';
import {
    LOADER_PATH,
    LOADER_VERSION,
    PLACEHOLDER,
    newRelicBrowser,
    readLoader,
    renderSnippet,
    resolveAgentConfig,
} from '../../../scripts/newrelic/vite-plugin.js';

const ENABLED = Object.freeze({
    NEW_RELIC_BROWSER_ENABLED: 'true',
    NEW_RELIC_ACCOUNT_ID: '7629005',
    NEW_RELIC_BROWSER_APPLICATION_ID: '1589185089',
    NEW_RELIC_BROWSER_LICENSE_KEY: 'NRBR-b5f8ce862e40dfb4cd2',
});

const SHA = '0123456789abcdef0123456789abcdef01234567';

// Made-up values in the shape of server-side keys.
const USER_API_KEY = ['NRAK', '0123456789ABCDEFGHIJKLMNOPQ'].join('-');
const LICENSE_KEY = ['0123456789abcdef0123456789abcdef0123', 'NRAL'].join('');

const LOADER = '/* loader */';

function messageOf(fn) {
    try {
        fn();
    } catch (error) {
        return error.message;
    }
    throw new Error('expected an error');
}

// Run the snippet like a browser would (with a stand-in loader) and
// return the NREUM global it leaves behind.
function runSnippet(snippet) {
    const context = vm.createContext({});
    context.window = context;
    vm.runInContext(
        snippet.replace(/^<script[^>]*>|<\/script>$/g, ''),
        context,
    );
    return context.NREUM;
}

// Objects made in another realm don't compare equal to ours.
const plain = (value) => JSON.parse(JSON.stringify(value));

// RegExps from another realm don't compare equal either; their parts do.
const describeRules = (rules) =>
    rules.map(({ regex, replacement }) => [
        regex.source,
        regex.flags,
        replacement,
    ]);

describe('scripts/newrelic/vite-plugin', () => {
    describe('resolveAgentConfig()', () => {
        it.each([
            {},
            { NEW_RELIC_BROWSER_ENABLED: '' },
            { NEW_RELIC_BROWSER_ENABLED: 'false' },
            { ...ENABLED, NEW_RELIC_BROWSER_ENABLED: ' false ' },
        ])('is off for %o', (env) => {
            expect(resolveAgentConfig(env)).toBeNull();
        });

        it.each(['1', 'yes', 'TRUE'])(
            'rejects NEW_RELIC_BROWSER_ENABLED=%o',
            (value) => {
                const env = { ...ENABLED, NEW_RELIC_BROWSER_ENABLED: value };
                expect(() => resolveAgentConfig(env)).toThrow(
                    'NEW_RELIC_BROWSER_ENABLED must be "true" or "false"',
                );
            },
        );

        it('builds the agent config', () => {
            const env = { ...ENABLED, CONTEXT: 'production', COMMIT_REF: SHA };
            expect(resolveAgentConfig(env)).toEqual({
                init: {
                    distributed_tracing: {
                        enabled: true,
                        exclude_newrelic_header: true,
                        cors_use_newrelic_header: false,
                        cors_use_tracecontext_headers: true,
                        allowed_origins: [],
                    },
                    ajax: {
                        deny_list: [
                            'googletagmanager.com',
                            'google-analytics.com',
                            'analytics.google.com',
                            'doubleclick.net',
                            'googleadservices.com',
                            'events.mapbox.com',
                        ],
                        capture_payloads: 'none',
                    },
                    performance: { capture_measures: true },
                    privacy: { cookies_enabled: true },
                    session_trace: { enabled: true },
                    session_replay: {
                        enabled: true,
                        autoStart: false,
                        preload: false,
                        mask_all_inputs: true,
                        mask_text_selector: '*',
                    },
                    browser_consent_mode: { enabled: false },
                },
                loaderConfig: {
                    accountID: '7629005',
                    trustKey: '7629005',
                    agentID: '1589185089',
                    licenseKey: 'NRBR-b5f8ce862e40dfb4cd2',
                    applicationID: '1589185089',
                },
                info: {
                    beacon: 'bam.nr-data.net',
                    errorBeacon: 'bam.nr-data.net',
                    licenseKey: 'NRBR-b5f8ce862e40dfb4cd2',
                    applicationID: '1589185089',
                    sa: 1,
                    jsAttributes: {
                        'environment': 'production',
                        'application.version': '0123456789ab',
                    },
                },
            });
        });

        it('leaves application.version out without a commit', () => {
            expect(resolveAgentConfig(ENABLED).info.jsAttributes).toEqual({
                environment: 'local',
            });
        });

        it('uses NEW_RELIC_TRUST_KEY for sub-accounts', () => {
            const env = { ...ENABLED, NEW_RELIC_TRUST_KEY: ' 1234567 ' };
            expect(resolveAgentConfig(env).loaderConfig.trustKey).toBe(
                '1234567',
            );
        });

        it.each([
            'NEW_RELIC_ACCOUNT_ID',
            'NEW_RELIC_BROWSER_APPLICATION_ID',
            'NEW_RELIC_BROWSER_LICENSE_KEY',
        ])('requires %s', (name) => {
            expect(() =>
                resolveAgentConfig({ ...ENABLED, [name]: undefined }),
            ).toThrow(`${name} must be`);
            expect(() =>
                resolveAgentConfig({ ...ENABLED, [name]: ' ' }),
            ).toThrow(`${name} must be`);
        });

        it.each([
            ['a user API key', USER_API_KEY],
            ['a license key', LICENSE_KEY],
        ])('refuses to ship %s as the browser key', (_label, key) => {
            const message = messageOf(() =>
                resolveAgentConfig({
                    ...ENABLED,
                    NEW_RELIC_BROWSER_LICENSE_KEY: key,
                }),
            );
            expect(message).toMatch(/must be a browser key/);
            expect(message).not.toContain(key);
        });

        it.each([
            ['NEW_RELIC_ACCOUNT_ID', USER_API_KEY],
            ['NEW_RELIC_TRUST_KEY', LICENSE_KEY],
            ['NEW_RELIC_BROWSER_APPLICATION_ID', '1589185089a'],
        ])('rejects a non-numeric %s without echoing it', (name, value) => {
            const message = messageOf(() =>
                resolveAgentConfig({ ...ENABLED, [name]: value }),
            );
            expect(message).toMatch(new RegExp(`${name} must be a numeric`));
            expect(message).not.toContain(value);
        });

        it('passes build info errors through', () => {
            expect(() =>
                resolveAgentConfig({ ...ENABLED, CONTEXT: 'Production' }),
            ).toThrow(/NEW_RELIC_ENVIRONMENT \(or CONTEXT\)/);
        });

        it('sends trace headers to the listed origins', () => {
            const env = {
                ...ENABLED,
                NEW_RELIC_BROWSER_DT_ALLOWED_ORIGINS:
                    ' https://maya-in.parkspot.in, ,http://localhost:3000 ',
            };
            expect(
                resolveAgentConfig(env).init.distributed_tracing
                    .allowed_origins,
            ).toEqual(['https://maya-in.parkspot.in', 'http://localhost:3000']);
        });

        it.each([
            'maya-in.parkspot.in',
            'https://maya-in.parkspot.in/',
            'https://maya-in.parkspot.in/api',
            'https://*.parkspot.in',
        ])('rejects %o as a trace origin', (origin) => {
            const env = {
                ...ENABLED,
                NEW_RELIC_BROWSER_DT_ALLOWED_ORIGINS: `https://maya-in.parkspot.in,${origin}`,
            };
            expect(() => resolveAgentConfig(env)).toThrow(
                'NEW_RELIC_BROWSER_DT_ALLOWED_ORIGINS entry 2 is not an origin',
            );
        });
    });

    describe('readLoader()', () => {
        let tmpDir;

        beforeEach(() => {
            tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nr-loader-'));
        });

        afterEach(() => {
            fs.rmSync(tmpDir, { recursive: true, force: true });
        });

        it('reads the pinned loader', () => {
            expect(path.basename(LOADER_PATH)).toBe(
                `nr-loader-spa-${LOADER_VERSION}.min.js`,
            );
            expect(readLoader()).toContain(LOADER_VERSION);
        });

        it('refuses a loader that does not match LOADER_SHA256', () => {
            const file = path.join(tmpDir, 'loader.js');
            fs.writeFileSync(file, `${readLoader()}\n`);
            expect(() => readLoader(file)).toThrow(
                /does not match LOADER_SHA256/,
            );
        });
    });

    describe('renderSnippet()', () => {
        const config = resolveAgentConfig({ ...ENABLED, COMMIT_REF: SHA });

        it('sets up NREUM, then runs the loader', () => {
            const snippet = renderSnippet(config, LOADER);
            expect(snippet).toMatch(
                /^<script type="text\/javascript">\nwindow\.NREUM/,
            );
            expect(snippet.endsWith(`\n${LOADER}\n</script>`)).toBe(true);

            const nreum = runSnippet(snippet);
            const { obfuscate, ...init } = nreum.init;
            expect(plain(init)).toEqual(config.init);
            expect(plain(nreum.loader_config)).toEqual(config.loaderConfig);
            expect(plain(nreum.info)).toEqual(config.info);
            expect(obfuscate).toHaveLength(OBFUSCATION_RULES.length);
        });

        it('hands the telemetry PII rules to the agent', () => {
            const { obfuscate } = runSnippet(
                renderSnippet(config, LOADER),
            ).init;
            expect(describeRules(obfuscate)).toEqual(
                describeRules(OBFUSCATION_RULES),
            );
            // As global RegExps: a string rule would be replaced
            // literally, and only once.
            const text = 'GET /srp?latlng=1,2 for 9876543210 or a@b.com';
            const scrub = (rules) =>
                rules.reduce(
                    (value, { regex, replacement }) =>
                        value.replace(regex, replacement),
                    text,
                );
            expect(scrub(obfuscate)).toBe('GET /srp for [phone] or [email]');
            expect(scrub(obfuscate)).toBe(scrub(OBFUSCATION_RULES));
        });

        it('cannot be broken out of by config values', () => {
            const hostile =
                '</script><script>alert(1)</script><!-- \u2028\u2029';
            const snippet = renderSnippet(
                {
                    ...config,
                    info: {
                        ...config.info,
                        jsAttributes: { environment: hostile },
                    },
                },
                LOADER,
            );
            expect(snippet.match(/<\/script/gi)).toHaveLength(1);
            expect(snippet).not.toContain('<!--');
            expect(snippet).not.toMatch(/[\u2028\u2029]/);
            expect(runSnippet(snippet).info.jsAttributes.environment).toBe(
                hostile,
            );
        });

        it.each(['x="</script>"', 'x="</SCRIPT "', '<!-- x'])(
            'refuses a loader containing %o',
            (loader) => {
                expect(() => renderSnippet(config, loader)).toThrow(
                    'the loader cannot be inlined safely',
                );
            },
        );
    });

    describe('newRelicBrowser()', () => {
        const HTML = `<head>\n${PLACEHOLDER}\n</head>`;
        let envDir;

        beforeEach(() => {
            envDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nr-env-'));
            // loadEnv() also reads process.env (where Netlify puts
            // CONTEXT and COMMIT_REF); keep this machine's values out.
            for (const key of Object.keys(process.env)) {
                if (/^(?:NEW_RELIC_|CONTEXT|COMMIT_REF)/.test(key)) {
                    vi.stubEnv(key, undefined);
                }
            }
        });

        afterEach(() => {
            vi.unstubAllEnvs();
            fs.rmSync(envDir, { recursive: true, force: true });
        });

        function setup({
            command = 'build',
            mode = 'production',
            env = {},
            envFile,
        } = {}) {
            if (envFile) {
                fs.writeFileSync(path.join(envDir, `.env.${mode}`), envFile);
            }
            for (const [key, value] of Object.entries(env)) {
                vi.stubEnv(key, value);
            }
            const plugin = newRelicBrowser();
            plugin.configResolved({ command, mode, envDir });
            return plugin;
        }

        it('drops the placeholder when the agent is off', () => {
            expect(setup().transformIndexHtml(HTML)).toBe('<head>\n\n</head>');
        });

        it('injects the snippet with the loader verbatim', () => {
            const html = setup({ env: ENABLED }).transformIndexHtml(HTML);
            expect(html).not.toContain(PLACEHOLDER);
            expect(html).toContain('NREUM.info=');
            // The real loader contains "$1$2", which a string
            // replacement would have expanded.
            expect(html).toContain(readLoader());
        });

        it('tags the build with its Netlify context and commit', () => {
            const html = setup({
                env: { ...ENABLED, CONTEXT: 'deploy-preview', COMMIT_REF: SHA },
            }).transformIndexHtml(HTML);
            expect(html).toContain(
                '"jsAttributes":{"environment":"deploy-preview",' +
                    '"application.version":"0123456789ab"}',
            );
        });

        it('reads .env.[mode] like Vite does', () => {
            const envFile = Object.entries(ENABLED)
                .map(([key, value]) => `${key}="${value}"`)
                .join('\n');
            expect(setup({ envFile }).transformIndexHtml(HTML)).toContain(
                'NREUM.info=',
            );
        });

        it('can be switched off by a real env var', () => {
            const envFile = Object.entries(ENABLED)
                .map(([key, value]) => `${key}="${value}"`)
                .join('\n');
            const plugin = setup({
                envFile,
                env: { NEW_RELIC_BROWSER_ENABLED: 'false' },
            });
            expect(plugin.transformIndexHtml(HTML)).toBe('<head>\n\n</head>');
        });

        it('fails the build when the config is incomplete', () => {
            expect(() =>
                setup({ env: { NEW_RELIC_BROWSER_ENABLED: 'true' } }),
            ).toThrow('NEW_RELIC_ACCOUNT_ID must be');
        });

        it.each([
            ['off', {}],
            ['on', ENABLED],
        ])(
            'fails a build whose index.html lost the placeholder (agent %s)',
            (_label, env) => {
                expect(() =>
                    setup({ env }).transformIndexHtml('<head></head>'),
                ).toThrow(`${PLACEHOLDER} is missing from index.html`);
            },
        );

        it('leaves other HTML alone in dev', () => {
            const plugin = setup({ command: 'serve', mode: 'development' });
            expect(plugin.transformIndexHtml('<head></head>')).toBe(
                '<head></head>',
            );
            expect(plugin.transformIndexHtml(HTML)).toBe('<head>\n\n</head>');
        });

        // What Vite hands the config hook for vite-ssg's client build.
        const CLIENT_BUILD = Object.freeze({
            command: 'build',
            mode: 'production',
            isSsrBuild: false,
        });

        it('turns on hidden source maps when the build plugin asks', () => {
            vi.stubEnv('NEW_RELIC_SOURCEMAPS', 'true');
            expect(newRelicBrowser().config({}, CLIENT_BUILD)).toEqual({
                build: { sourcemap: 'hidden' },
            });
        });

        it.each([
            ['the dev server', 'true', { command: 'serve' }],
            ['the SSR build, which never ships', 'true', { isSsrBuild: true }],
            ['a build that does not ask', undefined, {}],
            ['a build that asks for something else', 'false', {}],
        ])('leaves source maps off for %s', (_label, value, overrides) => {
            vi.stubEnv('NEW_RELIC_SOURCEMAPS', value);
            expect(
                newRelicBrowser().config({}, { ...CLIENT_BUILD, ...overrides }),
            ).toBeUndefined();
        });

        it('leaves source maps off when only a .env file asks', () => {
            // Nothing would delete them before the deploy.
            fs.writeFileSync(
                path.join(envDir, '.env.production'),
                'NEW_RELIC_SOURCEMAPS="true"\n',
            );
            expect(
                newRelicBrowser().config({ envDir }, CLIENT_BUILD),
            ).toBeUndefined();
        });
    });
});
