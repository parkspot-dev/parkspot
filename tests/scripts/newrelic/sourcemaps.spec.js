// @vitest-environment node
// Source maps go up to New Relic one request per map, keyed by the full
// URL of the script next to them, and are then deleted so they never
// ship. An upload problem must never throw (it is reported per file),
// must never echo the user API key, and a map that can't be deleted
// must reject.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import {
    SOURCEMAP_API,
    deleteSourcemaps,
    findSourcemaps,
    uploadSourcemaps,
} from '../../../scripts/newrelic/sourcemaps.js';

// Made up, in the shape of a user API key.
const USER_API_KEY = ['NRAK', '0123456789ABCDEFGHIJKLMNOPQ'].join('-');

const SHA = '0123456789abcdef0123456789abcdef01234567';
const ORIGIN = 'https://www.parkspot.in';
const UPLOAD_URL = `${SOURCEMAP_API}/v2/applications/1589185089/sourcemaps`;

// A publish directory like the client build's, with hidden maps.
const FILES = {
    'index.html': '<!doctype html>',
    'assets/index-a1b2c3d4.js': 'console.log(1)',
    'assets/index-a1b2c3d4.js.map': '{"version":3,"file":"index"}',
    'assets/vendor-e5f6a7b8.js': 'console.log(2)',
    'assets/vendor-e5f6a7b8.js.map': '{"version":3,"file":"vendor"}',
    'assets/index-c9d0e1f2.css': 'body{}',
    'assets/index-c9d0e1f2.css.map': '{"version":3}',
    'assets/orphan-a3b4c5d6.js.map': '{"version":3}',
    'assets/nested/route-f7a8b9c0.js': 'console.log(3)',
    'assets/nested/route-f7a8b9c0.js.map': '{"version":3,"file":"route"}',
};
const JS_MAPS = [
    'assets/index-a1b2c3d4.js.map',
    'assets/nested/route-f7a8b9c0.js.map',
    'assets/vendor-e5f6a7b8.js.map',
];
const ALL_MAPS = [
    'assets/index-a1b2c3d4.js.map',
    'assets/index-c9d0e1f2.css.map',
    'assets/nested/route-f7a8b9c0.js.map',
    'assets/orphan-a3b4c5d6.js.map',
    'assets/vendor-e5f6a7b8.js.map',
];

function writeFiles(dir, files) {
    for (const [name, content] of Object.entries(files)) {
        const file = path.join(dir, name);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, content);
    }
}

function respond(status) {
    return new Response(`{"status":${status}}`, { status });
}

describe('scripts/newrelic/sourcemaps', () => {
    let publishDir;

    beforeEach(() => {
        publishDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nr-dist-'));
        writeFiles(publishDir, FILES);
    });

    afterEach(() => {
        fs.rmSync(publishDir, { recursive: true, force: true });
    });

    function upload(fetchImpl, options = {}) {
        return uploadSourcemaps({
            publishDir,
            files: JS_MAPS,
            origin: ORIGIN,
            applicationId: '1589185089',
            apiKey: USER_API_KEY,
            commit: SHA,
            fetchImpl,
            retryDelayMs: 0,
            ...options,
        });
    }

    describe('findSourcemaps()', () => {
        it('lists every map under assets, sorted, with / separators', async () => {
            await expect(findSourcemaps(publishDir)).resolves.toEqual(ALL_MAPS);
        });

        it('finds none without an assets directory', async () => {
            fs.rmSync(path.join(publishDir, 'assets'), { recursive: true });
            await expect(findSourcemaps(publishDir)).resolves.toEqual([]);
        });

        it('rejects when assets cannot be read', async () => {
            fs.rmSync(path.join(publishDir, 'assets'), { recursive: true });
            fs.writeFileSync(path.join(publishDir, 'assets'), '');
            await expect(findSourcemaps(publishDir)).rejects.toMatchObject({
                code: 'ENOTDIR',
            });
        });
    });

    describe('uploadSourcemaps()', () => {
        it('uploads each map for the URL of its script', async () => {
            const fetchImpl = vi.fn(async () => respond(200));
            await expect(upload(fetchImpl)).resolves.toEqual({
                uploaded: JS_MAPS,
                existing: [],
                skipped: [],
                failed: [],
            });
            expect(fetchImpl).toHaveBeenCalledTimes(3);
            const forms = new Map();
            for (const [url, init] of fetchImpl.mock.calls) {
                expect(url).toBe(UPLOAD_URL);
                expect(init.method).toBe('POST');
                expect(init.headers).toEqual({
                    'Api-Key': USER_API_KEY,
                    'Accept': 'application/json',
                });
                expect(init.signal).toBeInstanceOf(AbortSignal);
                forms.set(init.body.get('javascriptUrl'), init.body);
            }
            const form = forms.get(`${ORIGIN}/assets/nested/route-f7a8b9c0.js`);
            expect(form.get('buildCommit')).toBe(SHA);
            const sourcemap = form.get('sourcemap');
            expect(sourcemap.name).toBe('route-f7a8b9c0.js.map');
            expect(await sourcemap.text()).toBe(
                FILES['assets/nested/route-f7a8b9c0.js.map'],
            );
            expect([...forms.keys()].sort()).toEqual([
                `${ORIGIN}/assets/index-a1b2c3d4.js`,
                `${ORIGIN}/assets/nested/route-f7a8b9c0.js`,
                `${ORIGIN}/assets/vendor-e5f6a7b8.js`,
            ]);
        });

        it('leaves out the commit when there is none', async () => {
            const fetchImpl = vi.fn(async () => respond(200));
            await upload(fetchImpl, { files: JS_MAPS.slice(0, 1), commit: '' });
            expect(fetchImpl.mock.calls[0][1].body.has('buildCommit')).toBe(
                false,
            );
        });

        it('skips maps with no script next to them', async () => {
            const fetchImpl = vi.fn(async () => respond(200));
            const result = await upload(fetchImpl, { files: ALL_MAPS });
            expect(result.uploaded).toEqual(JS_MAPS);
            expect(result.skipped).toEqual([
                'assets/index-c9d0e1f2.css.map',
                'assets/orphan-a3b4c5d6.js.map',
            ]);
            expect(fetchImpl).toHaveBeenCalledTimes(3);
        });

        it('counts a 409 as a map that is already there', async () => {
            const fetchImpl = vi.fn(async () => respond(409));
            const result = await upload(fetchImpl);
            expect(result.existing).toEqual(JS_MAPS);
            expect(result.failed).toEqual([]);
        });

        it.each([
            ['a network error', () => Promise.reject(new TypeError('boom'))],
            ['a 429', () => Promise.resolve(respond(429))],
            ['a 503', () => Promise.resolve(respond(503))],
        ])('tries once more after %s', async (_label, fail) => {
            const fetchImpl = vi
                .fn()
                .mockImplementationOnce(fail)
                .mockImplementationOnce(async () => respond(201));
            const result = await upload(fetchImpl, {
                files: JS_MAPS.slice(0, 1),
            });
            expect(result.uploaded).toEqual(JS_MAPS.slice(0, 1));
            expect(fetchImpl).toHaveBeenCalledTimes(2);
        });

        it('reports the last reason when the retry fails too', async () => {
            const fetchImpl = vi
                .fn()
                .mockImplementationOnce(async () => respond(503))
                .mockImplementationOnce(async () => {
                    throw new TypeError('fetch failed');
                });
            const result = await upload(fetchImpl, {
                files: JS_MAPS.slice(0, 1),
            });
            expect(result.failed).toEqual([
                {
                    file: JS_MAPS[0],
                    reason: 'could not reach New Relic: TypeError: fetch failed',
                },
            ]);
        });

        it('does not retry a 403, and never echoes the key', async () => {
            const fetchImpl = vi.fn(async () => respond(403));
            const result = await upload(fetchImpl);
            expect(fetchImpl).toHaveBeenCalledTimes(3);
            expect(result.failed).toEqual(
                JS_MAPS.map((file) => ({
                    file,
                    reason: 'New Relic answered 403',
                })),
            );
            expect(JSON.stringify(result)).not.toContain(USER_API_KEY);
        });

        it('gives up on a request after the timeout', async () => {
            const fetchImpl = vi.fn(
                (url, { signal }) =>
                    new Promise((resolve, reject) => {
                        signal.addEventListener('abort', () =>
                            reject(signal.reason),
                        );
                    }),
            );
            const result = await upload(fetchImpl, {
                files: JS_MAPS.slice(0, 1),
                timeoutMs: 5,
            });
            expect(fetchImpl).toHaveBeenCalledTimes(2);
            expect(result.failed[0].reason).toMatch(
                /^could not reach New Relic: TimeoutError/,
            );
        });

        it('releases every response body', async () => {
            const responses = [];
            const fetchImpl = vi.fn(async () => {
                const response = respond(responses.length ? 200 : 403);
                responses.push(response);
                return response;
            });
            await upload(fetchImpl);
            expect(responses).toHaveLength(3);
            expect(responses.every((response) => response.bodyUsed)).toBe(true);
        });

        it('runs at most `concurrency` uploads at a time', async () => {
            let running = 0;
            let peak = 0;
            const fetchImpl = vi.fn(async () => {
                running++;
                peak = Math.max(peak, running);
                await new Promise((resolve) => setTimeout(resolve, 5));
                running--;
                return respond(200);
            });
            const result = await upload(fetchImpl, {
                files: JS_MAPS,
                concurrency: 2,
            });
            expect(result.uploaded).toEqual(JS_MAPS);
            expect(peak).toBe(2);
        });

        it('reports a map it cannot read', async () => {
            writeFiles(publishDir, { 'assets/broken-d7e8f9a0.js': '' });
            fs.mkdirSync(
                path.join(publishDir, 'assets/broken-d7e8f9a0.js.map'),
            );
            const fetchImpl = vi.fn(async () => respond(200));
            const result = await upload(fetchImpl, {
                files: ['assets/broken-d7e8f9a0.js.map'],
            });
            expect(result.failed).toEqual([
                {
                    file: 'assets/broken-d7e8f9a0.js.map',
                    reason: 'could not read it (EISDIR)',
                },
            ]);
            expect(fetchImpl).not.toHaveBeenCalled();
        });

        it('does nothing without maps', async () => {
            const fetchImpl = vi.fn();
            await expect(upload(fetchImpl, { files: [] })).resolves.toEqual({
                uploaded: [],
                existing: [],
                skipped: [],
                failed: [],
            });
            expect(fetchImpl).not.toHaveBeenCalled();
        });
    });

    describe('deleteSourcemaps()', () => {
        it('deletes the maps and nothing else', async () => {
            await deleteSourcemaps(publishDir, ALL_MAPS);
            await expect(findSourcemaps(publishDir)).resolves.toEqual([]);
            for (const name of Object.keys(FILES)) {
                expect(fs.existsSync(path.join(publishDir, name))).toBe(
                    !name.endsWith('.map'),
                );
            }
        });

        it('does not mind a map that is already gone', async () => {
            await deleteSourcemaps(publishDir, ['assets/gone-b1c2d3e4.js.map']);
        });

        it('rejects unless every map is gone', async () => {
            fs.mkdirSync(
                path.join(publishDir, 'assets/broken-d7e8f9a0.js.map'),
            );
            const files = [...ALL_MAPS, 'assets/broken-d7e8f9a0.js.map'];
            const error = await deleteSourcemaps(publishDir, files).catch(
                (error) => error,
            );
            expect(error.message).toBe(
                '[newrelic] could not delete 1 of 6 source maps',
            );
            expect(error.cause).toBeInstanceOf(Error);
            // The others are gone all the same.
            expect(fs.existsSync(path.join(publishDir, ALL_MAPS[0]))).toBe(
                false,
            );
        });
    });
});
