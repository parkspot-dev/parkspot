// vite-ssg only honours `includedRoutes` when it is a top-level NAMED
// export of the server entry file (or lives in `ssgOptions.includedRoutes`
// in `vite.config.js`). Anywhere else — including the 4th-arg
// `ViteSSGClientOptions` slot of `ViteSSG(...)` — and vite-ssg falls back
// to rendering every static route from the router definition, leaking
// `/internal/*` and friends into the prerender set.
//
// This test pins the export shape so a future refactor cannot silently
// move the hook elsewhere again.
import { describe, expect, it, vi } from 'vitest';

// `src/main.js` pulls in heavy SPA-only modules (Buefy, vue-datepicker,
// vee-validate). Stub the noisier ones so the import is cheap and
// deterministic in the test runner. We are only inspecting the module's
// export shape; we are not executing the ViteSSG factory itself.
// Capture the setup fn passed to ViteSSG so the wiring tests below can
// invoke it under a controlled environment.
let capturedSetupFn = null;
vi.mock('vite-ssg', () => ({
    ViteSSG: (_App, _routerOpts, setupFn) => {
        capturedSetupFn = setupFn;
        return () => undefined;
    },
}));

vi.mock('buefy', () => ({ default: { install: () => {} } }));
vi.mock('buefy/dist/buefy.css', () => ({}));

vi.mock('@vuepic/vue-datepicker', () => ({ default: {} }));
vi.mock('@vuepic/vue-datepicker/dist/main.css', () => ({}));

vi.mock('aos/dist/aos.css', () => ({}));
vi.mock('aos', () => ({ default: { init: vi.fn() } }));

vi.mock('firebase/app', () => ({ initializeApp: vi.fn(() => ({})) }));
vi.mock('firebase/database', () => ({
    child: vi.fn(),
    get: vi.fn(),
    getDatabase: vi.fn(() => ({})),
    ref: vi.fn(() => ({})),
}));
vi.mock('firebase/auth', async () => {
    const actual = await vi.importActual('firebase/auth');
    return {
        ...actual,
        getAuth: vi.fn(() => ({})),
        onAuthStateChanged: vi.fn(),
    };
});

describe('src/main.js exports contract', () => {
    it('re-exports `includedRoutes` as a top-level named export', async () => {
        const main = await import('@/main.js');
        expect(main).toHaveProperty('includedRoutes');
        expect(typeof main.includedRoutes).toBe('function');
    }, 15000);

    it('also exports the ViteSSG-wrapped `createApp` factory', async () => {
        const main = await import('@/main.js');
        expect(main).toHaveProperty('createApp');
    }, 15000);
});

describe('src/main.js setup fn — seedAppStore wiring', () => {
    it('seeds the default-export store BEFORE app.use(store)', async () => {
        capturedSetupFn = null;
        vi.resetModules();
        await import('@/main.js');
        expect(capturedSetupFn).toBeTypeOf('function');

        const callOrder = [];
        const fakeStore = { replaceState: vi.fn(), state: {} };
        const createAppStoreSpy = vi.fn(() => fakeStore);
        const seedAppStoreSpy = vi.fn(() => callOrder.push('seedAppStore'));
        vi.doMock('@/store', () => ({
            createAppStore: createAppStoreSpy,
            seedAppStore: seedAppStoreSpy,
            default: {},
        }));

        vi.resetModules();
        await import('@/main.js');
        expect(capturedSetupFn).toBeTypeOf('function');

        const app = {
            use: vi.fn(() => callOrder.push('app.use')),
            mixin: vi.fn(),
            component: vi.fn(),
        };
        capturedSetupFn({ app, isClient: true, initialState: {} });

        expect(seedAppStoreSpy).toHaveBeenCalledTimes(1);
        expect(seedAppStoreSpy).toHaveBeenCalledWith(fakeStore);
        expect(app.use).toHaveBeenCalledWith(fakeStore);
        expect(callOrder.indexOf('seedAppStore')).toBeLessThan(
            callOrder.indexOf('app.use'),
        );

        vi.doUnmock('@/store');
    }, 15000);
});
