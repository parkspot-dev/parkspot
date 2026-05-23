import { fileURLToPath, URL } from 'node:url';
import { playwright } from '@vitest/browser-playwright';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// Strip external CSS @import and url() during tests so headless
// Chromium does not hang on Google Fonts / external image requests
// that may never resolve (CI/offline).
function stripExternalCssImports() {
    return {
        name: 'strip-external-css-imports',
        enforce: 'pre',
        transform(code, id) {
            if (process.env.VITEST && /\.(scss|css|vue)$/.test(id)) {
                let result = code.replace(
                    /@import\s+['"]https?:\/\/[^'"]+['"];?/g,
                    '/* [test] external import stripped */',
                );
                result = result.replace(
                    /url\(\s*['"]?https?:\/\/[^)]+\)/g,
                    'url()',
                );
                return result !== code ? result : undefined;
            }
            return undefined;
        },
    };
}

// During visual tests, intercept /assets/* requests and serve instant
// minimal placeholders. This prevents network-idle stalls caused by
// image/SVG loading — the primary source of CI timeouts.
const TRANSPARENT_PNG = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIABQAB' +
    'Nl7BcQAAAABJRU5ErkJggg==', 'base64',
);
const EMPTY_SVG = '<svg xmlns="http://www.w3.org/2000/svg"/>';

function stubStaticAssets() {
    return {
        name: 'stub-static-assets',
        configureServer(server) {
            if (!process.env.VITEST) return;
            server.middlewares.use((req, res, next) => {
                if (!req.url || !req.url.startsWith('/assets/')) return next();
                if (/\.svg(\?|$)/.test(req.url)) {
                    res.setHeader('Content-Type', 'image/svg+xml');
                    res.end(EMPTY_SVG);
                } else if (/\.(png|jpe?g|gif|webp|avif|ico)(\?|$)/.test(req.url)) {
                    res.setHeader('Content-Type', 'image/png');
                    res.end(TRANSPARENT_PNG);
                } else {
                    next();
                }
            });
        },
    };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [
        vue(),
        ...(mode === 'test' ? [stripExternalCssImports(), stubStaticAssets()] : [vueDevTools()]),
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
