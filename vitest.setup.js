// vitest.setup.js
import { config } from '@vue/test-utils';

// Example: ignore certain Vue warnings
config.global.config.warnHandler = () => {};
