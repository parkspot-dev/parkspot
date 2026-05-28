import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), vueDevTools()],
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
        alias: {
            'vite-ssg': fileURLToPath(
                new URL('./tests/mocks/vite-ssg.js', import.meta.url),
            ),
        },
        globals: true,
        environment: 'jsdom',
        // setupFiles: './vitest.setup.js',

        // Coverage configuration
        coverage: {
            provider: 'v8', // Use V8's built-in coverage
            reporter: ['text', 'json-summary', 'json', 'html'], // Multiple reporters
            reportsDirectory: './coverage', // Output directory

            // Files to include in coverage
            include: ['src/**/*.{js,vue}'],

            // Files to exclude from coverage
            exclude: [
                'node_modules/**',
                'tests/**',
                'src/main.js', // Entry point
                '**/*.spec.js',
                '**/*.test.js',
            ],
        },
    },
});
