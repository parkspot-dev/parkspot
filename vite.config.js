import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), vueDevTools()],
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
        environment: 'jsdom', // Simulate a browser environment
        // setupFiles: './vitest.setup.js' // Optional setup file
    },
});
