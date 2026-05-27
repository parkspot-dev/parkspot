// Guards the SSG hydration contract for the `device` Vuex module:
//   - `state` must not capture `navigator.userAgent` at module-eval time
//     (otherwise the SSR snapshot leaks Node's stub UA into the
//     hydrated client store).
//   - `getters.details` must compute the UA on-demand in whichever
//     environment it's called, falling back to `''` on the server.
import { afterEach, describe, expect, it } from 'vitest';

import deviceModule from '@/store/device';

describe('store/device', () => {
    const originalNavigator = globalThis.navigator;

    afterEach(() => {
        // restore whatever vitest's environment had wired up
        if (originalNavigator === undefined) {
            // jsdom sets navigator; deleting on a non-configurable property is a no-op,
            // but assigning back to the original keeps any descriptor in place.
            return;
        }
        Object.defineProperty(globalThis, 'navigator', {
            value: originalNavigator,
            configurable: true,
            writable: true,
        });
    });

    it('does not read navigator at module-eval time', () => {
        // If the previous shape (`details: navigator.userAgent` in state)
        // returns, importing the module under an SSR-like Node env would
        // throw. We assert by structure: `state` is a factory that produces
        // only the static `regexp` field, and the UA lives on `getters`.
        expect(typeof deviceModule.state).toBe('function');
        const snapshot = deviceModule.state();
        expect(snapshot).toEqual({ regexp: expect.any(RegExp) });
        expect(snapshot).not.toHaveProperty('details');
    });

    it('exposes `details` via a getter so it can be re-evaluated per environment', () => {
        expect(typeof deviceModule.getters.details).toBe('function');
    });

    it('returns the current navigator user-agent when running in the browser', () => {
        Object.defineProperty(globalThis, 'navigator', {
            value: { userAgent: 'Test-UA/1.0' },
            configurable: true,
            writable: true,
        });

        expect(deviceModule.getters.details()).toBe('Test-UA/1.0');
    });

    it('returns an empty string when navigator is not defined (SSR)', () => {
        // Simulate the SSR environment by hiding navigator entirely. We
        // cannot `delete globalThis.navigator` reliably across runtimes,
        // so we replace it with a typeof-undefined value via Reflect.
        Object.defineProperty(globalThis, 'navigator', {
            value: undefined,
            configurable: true,
            writable: true,
        });

        expect(deviceModule.getters.details()).toBe('');
    });
});
