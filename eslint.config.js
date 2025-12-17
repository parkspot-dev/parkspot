import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import prettier from 'eslint-config-prettier';
import google from 'eslint-config-google';
import globals from 'globals';

export default [
  // Base JS recommended rules
  js.configs.recommended,

  // Google style guide
  google,

  // Vue 3 recommended rules
  ...pluginVue.configs['flat/recommended'],

  // Prettier (turns off conflicting rules) - must be last
  prettier,

  // Main configuration
  {
    files: ['src/**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
      },
    },
    rules: {
      // Match your original rules
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      
      // Google style overrides (optional - adjust as needed)
      'require-jsdoc': 'off',  // Often disabled as it's too strict
      'valid-jsdoc': 'off',    // Often disabled as it's too strict
    },
  },

  // Ignore patterns
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      '**/*.config.js',
      '**/*.config.cjs',
      '**/*.config.mjs',
    ],
  },
];