// vite.config.js

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    // #TECH_DEBT
    // Add .vue extension to SFC imports
    // While this works, it should be avoided because according to the Vite docs:
    // "Note it is NOT recommended to omit extensions for custom import types (e.g. .vue)
    //  since it can interfere with IDE and type support."
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  }
}) 