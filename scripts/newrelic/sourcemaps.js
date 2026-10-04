// Source maps for readable stack traces on the browser app's errors.
//
// When netlify/plugins/newrelic asks for them, the client build writes a
// hidden source map next to every chunk (see vite-plugin.js): the .map
// file is there, the sourceMappingURL comment is not, so browsers never
// ask for it. The plugin uploads the maps with uploadSourcemaps(), then
// deletes them all with deleteSourcemaps() before the deploy, so the
// original source never goes public.
//
// New Relic picks the map for a stack frame by the script's full URL.
// Chunk names carry a content hash, so the URL alone pins the build and
// no release name is sent.
// https://docs.newrelic.com/docs/browser/new-relic-browser/browser-pro-features/upload-source-maps-api/

import fs from 'node:fs/promises';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

// US datacenter; EU accounts use sourcemaps.service.eu.newrelic.com.
export const SOURCEMAP_API = 'https://sourcemaps.service.newrelic.com';
// Vite's build.assetsDir: every chunk and its map land here.
export const ASSETS_DIR = 'assets';
export const UPLOAD_TIMEOUT_MS = 30000;
// A deploy has about 45 maps; the API takes 1,000 a minute per account.
export const CONCURRENCY = 4;
// Timeouts, network errors, 429 and 5xx get one more try after a pause.
// Uploading a map twice is harmless.
const ATTEMPTS = 2;
const RETRY_DELAY_MS = 1000;

/**
 * The source maps in `publishDir`/assets, as sorted paths relative to
 * `publishDir` ("assets/index-1a2b3c4d.js.map"). None when there is no
 * assets directory.
 * @param {string} publishDir
 * @return {Promise<string[]>}
 */
export async function findSourcemaps(publishDir) {
    let names;
    try {
        names = await fs.readdir(path.join(publishDir, ASSETS_DIR), {
            recursive: true,
        });
    } catch (error) {
        if (error.code === 'ENOENT') return [];
        throw error;
    }
    return names
        .filter((name) => name.endsWith('.map'))
        .map((name) => path.posix.join(ASSETS_DIR, ...name.split(path.sep)))
        .sort();
}

async function isFile(file) {
    try {
        return (await fs.stat(file)).isFile();
    } catch {
        return false;
    }
}

// Run `task` on every item, at most `limit` at a time. Results keep the
// order of `items`.
async function mapLimit(items, limit, task) {
    const results = [];
    let next = 0;
    async function worker() {
        while (next < items.length) {
            const index = next++;
            results[index] = await task(items[index]);
        }
    }
    const workers = Math.max(1, Math.min(limit, items.length));
    await Promise.all(Array.from({ length: workers }, worker));
    return results;
}

async function uploadOne({ file, script }, options) {
    const { publishDir, origin, applicationId, apiKey, commit } = options;
    const { fetchImpl, timeoutMs, retryDelayMs } = options;
    let bytes;
    try {
        bytes = await fs.readFile(path.join(publishDir, file));
    } catch (error) {
        const code = error.code ?? error.message;
        return { outcome: 'failed', reason: `could not read it (${code})` };
    }
    const url = `${SOURCEMAP_API}/v2/applications/${applicationId}/sourcemaps`;
    let reason;
    for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
        if (attempt > 1) await sleep(retryDelayMs);
        const form = new FormData();
        form.set('javascriptUrl', `${origin}/${script}`);
        if (commit) form.set('buildCommit', commit);
        form.set(
            'sourcemap',
            new Blob([bytes], { type: 'application/json' }),
            path.posix.basename(file),
        );
        let response;
        try {
            response = await fetchImpl(url, {
                method: 'POST',
                headers: { 'Api-Key': apiKey, 'Accept': 'application/json' },
                body: form,
                signal: AbortSignal.timeout(timeoutMs),
            });
        } catch (error) {
            reason = `could not reach New Relic: ${error}`;
            continue;
        }
        // Only the status matters; release the connection.
        await response.body?.cancel().catch(() => {});
        if (response.ok) return { outcome: 'uploaded' };
        // Not documented; taken to mean the map is already there.
        if (response.status === 409) return { outcome: 'existing' };
        // 403 is a wrong key, or one without access to the app. The key
        // itself is never logged.
        reason = `New Relic answered ${response.status}`;
        if (response.status !== 429 && response.status < 500) break;
    }
    return { outcome: 'failed', reason };
}

/**
 * Upload source maps to the browser app, each for the script next to it
 * (assets/x.js.map for assets/x.js, as served from `origin`). Maps with
 * no script next to them, like CSS maps, are skipped. Never throws:
 * failures are reported per file.
 * @param {object} options
 * @param {string} options.publishDir
 * @param {string[]} options.files from findSourcemaps()
 * @param {string} options.origin where the site is served from, like
 *     https://www.parkspot.in
 * @param {string} options.applicationId browser app ID
 * @param {string} options.apiKey user API key (NRAK-...)
 * @param {string} [options.commit] full commit SHA
 * @param {typeof fetch} [options.fetchImpl]
 * @param {number} [options.concurrency]
 * @param {number} [options.timeoutMs] per request
 * @param {number} [options.retryDelayMs]
 * @return {Promise<{
 *     uploaded: string[],
 *     existing: string[],
 *     skipped: string[],
 *     failed: { file: string, reason: string }[],
 * }>}
 */
export async function uploadSourcemaps({
    publishDir,
    files,
    origin,
    applicationId,
    apiKey,
    commit,
    fetchImpl = fetch,
    concurrency = CONCURRENCY,
    timeoutMs = UPLOAD_TIMEOUT_MS,
    retryDelayMs = RETRY_DELAY_MS,
}) {
    const result = { uploaded: [], existing: [], skipped: [], failed: [] };
    const jobs = [];
    for (const file of files) {
        const script = file.endsWith('.js.map') ? file.slice(0, -4) : '';
        if (script && (await isFile(path.join(publishDir, script)))) {
            jobs.push({ file, script });
        } else {
            result.skipped.push(file);
        }
    }
    const options = {
        publishDir,
        origin,
        applicationId,
        apiKey,
        commit,
        fetchImpl,
        timeoutMs,
        retryDelayMs,
    };
    const outcomes = await mapLimit(jobs, concurrency, (job) =>
        uploadOne(job, options),
    );
    outcomes.forEach(({ outcome, reason }, index) => {
        const { file } = jobs[index];
        if (outcome === 'failed') result.failed.push({ file, reason });
        else result[outcome].push(file);
    });
    return result;
}

/**
 * Delete source maps (paths relative to `publishDir`). Rejects unless
 * every one of them is gone.
 * @param {string} publishDir
 * @param {string[]} files
 * @return {Promise<void>}
 */
export async function deleteSourcemaps(publishDir, files) {
    const results = await Promise.allSettled(
        files.map((file) =>
            fs.rm(path.join(publishDir, file), { force: true }),
        ),
    );
    const failures = results.filter(({ status }) => status === 'rejected');
    if (failures.length) {
        throw new Error(
            `[newrelic] could not delete ${failures.length} of ` +
                `${files.length} source maps`,
            { cause: failures[0].reason },
        );
    }
}
