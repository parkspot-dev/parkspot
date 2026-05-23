// Post-build step: emit `dist/sitemap.xml` from the same RTDB slug list that
// `vite-ssg includedRoutes` used to prerender area pages. Keeping these two
// sources in lockstep is critical — otherwise the sitemap can advertise URLs
// that 404 (or vice versa, prerendered pages with no sitemap entry).
//
// Invoked from `package.json`'s `build` script:
//   `vite-ssg build && node scripts/generate-sitemap.js`

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import {
    fetchAllSeoSlugs,
} from '../src/utils/seo/rtdb-build.js';

const ORIGIN = 'https://www.parkspot.in';
const DIST_DIR = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '..',
    'dist',
);

/**
 * Curated list of always-shipped static paths. Kept in sync with the
 * "Tier B" inventory in `ssg-research/02-seo-page-inventory.md`. Anything
 * gated behind auth (`/internal/...`, `/payment/...`, `/profile/...`) is
 * deliberately excluded.
 */
export const STATIC_PATHS = [
    '/',
    '/about/',
    '/faq/',
    '/features/',
    '/contact/',
    '/blog/',
    '/srp/',
    '/get-parking-spot/',
    '/register-parking-spot/',
    '/terms-and-conditions/',
    '/privacy/',
    '/automated-parking/',
    '/thank-you/',
    '/error/',
];

/**
 * Build a `<url>` entry for a given path.
 * @param {string} pathStr
 * @returns {string}
 */
export function buildUrlEntry(pathStr) {
    if (typeof pathStr !== 'string' || !pathStr.startsWith('/')) {
        throw new TypeError(
            `[generate-sitemap] expected absolute path starting with "/", got: ${pathStr}`,
        );
    }
    const xmlSafe = `${ORIGIN}${pathStr}`
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    return `<url><loc>${xmlSafe}</loc></url>`;
}

/**
 * Compose the full sitemap XML body from a list of paths.
 * @param {string[]} paths
 * @returns {string}
 */
export function buildSitemapXml(paths) {
    const entries = paths.map(buildUrlEntry).join('\n  ');
    return (
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  ' +
        entries +
        '\n</urlset>\n'
    );
}

export async function generateSitemap({ distDir = DIST_DIR } = {}) {
    let bangalore = [];
    let hyderabad = [];

    try {
        const slugs = await fetchAllSeoSlugs();
        bangalore = slugs.bangalore;
        hyderabad = slugs.hyderabad;
    } catch (err) {
        // Match the philosophy of the route enumeration: a broken RTDB call
        // must not silently produce a degraded sitemap. Bail with a clear
        // error so CI catches it.
        // eslint-disable-next-line no-console
        console.error(
            '[generate-sitemap] fetching SEO slugs failed; aborting:',
            err,
        );
        throw err;
    }

    const allPaths = [
        ...STATIC_PATHS,
        ...bangalore.map((s) => `/bangalore/parking-near-${s}/`),
        ...hyderabad.map((s) => `/hyderabad/parking-near-${s}/`),
    ];

    const xml = buildSitemapXml(allPaths);

    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
    }
    const outPath = path.join(distDir, 'sitemap.xml');
    fs.writeFileSync(outPath, xml, 'utf8');

    // eslint-disable-next-line no-console
    console.log(
        `[generate-sitemap] wrote ${allPaths.length} URLs -> ${outPath}`,
    );

    return { outPath, count: allPaths.length };
}

// Invoke only when run as the entrypoint, so the file is safely importable
// from unit tests.
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
    generateSitemap().catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err);
        process.exit(1);
    });
}
