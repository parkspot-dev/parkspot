import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), vueDevTools()],
    // vite-ssg configuration. `crawl: false` makes vite-ssg render exactly
    // the paths returned from `includedRoutes()` in `src/main.js` and
    // nothing else. With `crawl: true` (the default) vite-ssg walks
    // `<a href>` / `<router-link>` tags inside every rendered page and
    // recursively renders whatever it discovers — which is how
    // `/internal/*`, `/payment/*` and similar gated paths leak into the
    // prerender set despite the `includedRoutes` filter (their links exist
    // inside the navbar / footer / profile menus). Disabling crawl gives
    // us a deterministic, auditable URL set instead.
    ssgOptions: {
        crawl: false,
        formatting: 'minify',
        script: 'async',
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
        environment: 'jsdom',
        // setupFiles: './vitest.setup.js',
        
        // Coverage configuration
        coverage: {
            provider: 'v8',  // Use V8's built-in coverage
            reporter: ['text', 'json-summary', 'json', 'html'],  // Multiple reporters
            reportsDirectory: './coverage',  // Output directory
            
            // Files to include in coverage
            include: ['src/**/*.{js,vue}'],
            
            // Files to exclude from coverage
            exclude: [
                'node_modules/**',
                'tests/**',
                'src/main.js',  // Entry point
                '**/*.spec.js',
                '**/*.test.js',
            ],
        },
    },
});