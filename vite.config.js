import { fileURLToPath, URL } from 'node:url';
import { playwright } from '@vitest/browser-playwright';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// Strip network-blocking resources during tests. Two layers:
//
// 1. Transform (compile-time): rewrites source code for local .vue/.scss
//    files so the browser never issues blocking requests.
//
// 2. Server middleware (runtime): intercepts any /assets/* HTTP request
//    that slipped through (e.g. from node_modules CSS that Vite skips
//    user transforms on) and serves instant placeholders.
//
// Both layers are needed because Vite does NOT run user transform hooks
// on pre-bundled node_modules CSS (like buefy.css).

const TRANSPARENT_PNG_B64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIABQABNl7BcQAAAABJRU5ErkJggg==';
const TRANSPARENT_PNG = Buffer.from(TRANSPARENT_PNG_B64, 'base64');
const EMPTY_SVG = '<svg xmlns="http://www.w3.org/2000/svg"/>';

function stripTestBlockingResources() {
    return {
        name: 'strip-test-blocking-resources',
        enforce: 'pre',
        transform(code, id) {
            if (!/\.(scss|css|vue)(\?.*)?$/.test(id)) return undefined;

            let result = code;
            // External @import — quoted string form (@import 'https://...')
            // Must match full quoted URL including semicolons (Google Fonts uses them).
            result = result.replace(
                /@import\s+(['"])https?:\/\/.*?\1\s*;?/g,
                '/* [test] external import stripped */',
            );
            // External @import — url() form (@import url(...))
            result = result.replace(
                /@import\s+url\(\s*['"]?https?:\/\/[^)]+\)\s*;?/g,
                '/* [test] external import stripped */',
            );
            // External url()
            result = result.replace(
                /url\(\s*['"]?https?:\/\/[^)]+\)/g,
                'url(data:,)',
            );
            // Local /assets/* background images / CSS url() references
            result = result.replace(
                /url\(\s*['"]?\/assets\/[^)]+\)/g,
                'url(data:,)',
            );
            // JS strings containing url(/assets/...) used by v-bind() CSS
            result = result.replace(
                /(['"`])url\(\s*['"]?\/assets\/[^)]+\)\1/g,
                '$1none$1',
            );
            // Static <img src="/assets/..."> in templates (only in HTML context)
            // Use a data URI (not src="") — empty src triggers a request to the page URL.
            result = result.replace(
                /<img\b[^>]*\bsrc="\/assets\/[^"]+"/g,
                (match) => match.replace(/src="\/assets\/[^"]+"/, `src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"`),
            );
            return result !== code ? result : undefined;
        },
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                if (!req.url) return next();
                // Serve instant placeholders for /assets/* image requests
                if (req.url.startsWith('/assets/')) {
                    if (/\.svg(\?|$)/i.test(req.url)) {
                        res.setHeader('Content-Type', 'image/svg+xml');
                        res.setHeader('Cache-Control', 'max-age=31536000');
                        return res.end(EMPTY_SVG);
                    }
                    if (/\.(png|jpe?g|gif|webp|avif|ico)(\?|$)/i.test(req.url)) {
                        res.setHeader('Content-Type', 'image/png');
                        res.setHeader('Cache-Control', 'max-age=31536000');
                        return res.end(TRANSPARENT_PNG);
                    }
                }
                next();
            });
        },
    };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    // Disable static file serving from public/ during tests so that
    // /assets/* requests hit our middleware (instant placeholders)
    // instead of loading real images that stall network idle.
    publicDir: mode === 'test' ? false : 'public',
    plugins: [
        vue(),
        ...(mode === 'test' ? [stripTestBlockingResources()] : [vueDevTools()]),
    ],
    // vite-ssg configuration. Only fields that appear in upstream's
    // `ViteSSGOptions` type are accepted; unknown keys are silently
    // dropped, so it is easy to ship dead config (see git history for
    // `crawl: false`, which was never a real option). The route set is
    // fully determined by the `includedRoutes` export from
    // `src/main.js` — no HTML/link crawling happens regardless.
    ssgOptions: {
        formatting: 'minify',
        script: 'async',
        // Emit `dist/about/index.html` instead of `dist/about.html` for
        // every route. The area pages we ship from `includedRoutes`
        // already use the nested shape (their paths carry a trailing
        // slash), as does `scripts/verify-ssg-output.js` and the URLs
        // in `scripts/generate-sitemap.js`. Without this option the
        // static pages emit as flat `.html` files and the canonical
        // URL set is inconsistent (e.g. `/about` vs `/bangalore/.../`).
        dirStyle: 'nested',
    },
    // for run dev
    server: {
        port: 8080,
    },
    // for run serve
    preview: {
        port: 8080,
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '/assets': '/public/assets',
        },
        // #TECH_DEBT
        // Add .vue extension to SFC imports
        // While this works, it should be avoided because according to the Vite docs:
        // "Note it is NOT recommended to omit extensions for custom import types (e.g. .vue)
        //  since it can interfere with IDE and type support."
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    test: {
        globals: true,
        // Coverage applies across all projects.
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json-summary', 'json', 'html'],
            reportsDirectory: './coverage',
            include: ['src/**/*.{js,vue}'],
            exclude: [
                'node_modules/**',
                'tests/**',
                'src/main.js',
                '**/*.spec.js',
                '**/*.test.js',
            ],
        },

        // Two projects: the existing fast jsdom unit tests, and a
        // separate browser-based project for pixel-level visual
        // regression. They are split so `npm run test:unit` stays
        // millisecond-fast and only the dedicated `test:visual`
        // command pays the cost of spinning up a real Chromium.
        projects: [
            {
                extends: true,
                test: {
                    name: 'unit',
                    environment: 'jsdom',
                    include: ['tests/**/*.spec.js'],
                    exclude: ['tests/visual/**'],
                },
            },
            {
                extends: true,
                test: {
                    name: 'visual',
                    include: ['tests/visual/**/*.visual.spec.js'],
                    setupFiles: ['./tests/visual/setup.js'],
                    testTimeout: 15000,
                    browser: {
                        enabled: true,
                        provider: playwright(),
                        headless: true,
                        viewport: { width: 1280, height: 800 },
                        instances: [{ browser: 'chromium' }],
                    },
                    expect: {
                        // Allow up to 1% pixel-difference and a hard
                        // ceiling of 200 changed pixels per shot to
                        // absorb sub-pixel font / shadow jitter.
                        toMatchScreenshot: {
                            maxDiffPixelRatio: 0.01,
                            maxDiffPixels: 200,
                        },
                    },
                },
            },
        ],
    },
}));
