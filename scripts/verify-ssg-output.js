// Post-build canary: assert that vite-ssg actually produced filled-in HTML
// for a handful of pages. Catches regressions where the build "succeeds" but
// silently emits empty SPA shells (e.g. due to a missed top-level browser
// global, a thrown error inside `serverPrefetch`, or an RTDB outage that
// shipped zero area pages).
//
// Invoked from `package.json`'s `build` script as the final step:
//   `vite-ssg build && node scripts/generate-sitemap.js && node scripts/verify-ssg-output.js`

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const DIST_DIR = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '..',
    'dist',
);

/**
 * Verification spec. Each entry is a relative HTML path under `dist/` and a
 * set of substrings (or regexes) that must appear in the rendered HTML.
 *
 * Kept conservative: every assertion below describes content that comes from
 * a static template (App.vue / Navbar / Footer / route components) — nothing
 * that depends on RTDB data, so this set works even when the area-page
 * prerender pipeline is offline.
 */
export const VERIFICATION_SPEC = [
    {
        file: 'index.html',
        mustMatch: [/<div id="app">/, /<title>.+<\/title>/],
        mustNotMatch: [/<div id="app"><\/div>/],
    },
    {
        file: 'about/index.html',
        mustMatch: [/<div id="app">/, /<title>.+<\/title>/],
        mustNotMatch: [/<div id="app"><\/div>/],
    },
    {
        file: 'faq/index.html',
        mustMatch: [/<div id="app">/, /<title>.+<\/title>/],
        mustNotMatch: [/<div id="app"><\/div>/],
    },
    {
        file: 'features/index.html',
        mustMatch: [/<div id="app">/, /<title>.+<\/title>/],
        mustNotMatch: [/<div id="app"><\/div>/],
    },
    {
        file: 'contact/index.html',
        mustMatch: [/<div id="app">/, /<title>.+<\/title>/],
        mustNotMatch: [/<div id="app"><\/div>/],
    },
];

/**
 * Run the canary checks against a directory of rendered HTML.
 *
 * @param {object} [opts]
 * @param {string} [opts.distDir]
 * @param {Array<{file: string, mustMatch?: RegExp[], mustNotMatch?: RegExp[]}>} [opts.spec]
 * @returns {Array<{file: string, ok: boolean, reasons: string[]}>}
 */
export function verifySsgOutput({
    distDir = DIST_DIR,
    spec = VERIFICATION_SPEC,
} = {}) {
    return spec.map((entry) => {
        const filePath = path.join(distDir, entry.file);
        const reasons = [];

        if (!fs.existsSync(filePath)) {
            reasons.push(`missing file: ${filePath}`);
            return { file: entry.file, ok: false, reasons };
        }

        const html = fs.readFileSync(filePath, 'utf8');

        for (const re of entry.mustMatch || []) {
            if (!re.test(html)) {
                reasons.push(`expected to match ${re}`);
            }
        }

        for (const re of entry.mustNotMatch || []) {
            if (re.test(html)) {
                reasons.push(`expected NOT to match ${re}`);
            }
        }

        return { file: entry.file, ok: reasons.length === 0, reasons };
    });
}

const isMain = (() => {
    if (!import.meta.url) return false;
    try {
        return path.resolve(fileURLToPath(import.meta.url)) ===
            path.resolve(process.argv[1] || '');
    } catch {
        return false;
    }
})();

if (isMain) {
    const results = verifySsgOutput();
    const failed = results.filter((r) => !r.ok);
    if (failed.length > 0) {
        for (const r of failed) {
            // eslint-disable-next-line no-console
            console.error(`[verify-ssg] FAIL ${r.file}`);
            for (const reason of r.reasons) {
                // eslint-disable-next-line no-console
                console.error(`  - ${reason}`);
            }
        }
        process.exit(1);
    }
    // eslint-disable-next-line no-console
    console.log(`[verify-ssg] OK (${results.length} files checked)`);
}
