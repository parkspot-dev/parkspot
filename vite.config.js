import { fileURLToPath, URL } from 'node:url';
import { playwright } from '@vitest/browser-playwright';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [vue(), ...(mode === 'test' ? [] : [vueDevTools()])],
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
