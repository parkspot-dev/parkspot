// vitest.setup.js
import { config } from '@vue/test-utils';
import { expect } from 'vitest';

// Example: ignore certain Vue warnings
config.global.config.warnHandler = () => {};

expect.addSnapshotSerializer({
    test: (val) => typeof val === 'string' && val.includes('data-v-'),
    serialize: (val) => val.replace(/ data-v-[a-z0-9]+=""/g, ''),
});