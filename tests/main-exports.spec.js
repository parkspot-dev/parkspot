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
vi.mock('vite-ssg', () => ({
    ViteSSG: (..._args) => () => undefined,
}));

vi.mock('buefy', () => ({ default: { install: () => {} } }));
vi.mock('buefy/dist/buefy.css', () => ({}));

vi.mock('@vuepic/vue-datepicker', () => ({ default: {} }));
vi.mock('@vuepic/vue-datepicker/dist/main.css', () => ({}));

vi.mock('aos/dist/aos.css', () => ({}));

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
    });

    it('also exports the ViteSSG-wrapped `createApp` factory', async () => {
        const main = await import('@/main.js');
        expect(main).toHaveProperty('createApp');
    });
});
