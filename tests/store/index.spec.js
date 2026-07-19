import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('firebase/app', () => ({
    initializeApp: vi.fn(() => ({})),
}));

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

import store from '@/store';

describe('root store', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Structure tests', () => {
        it('registers the expected vuex modules', () => {
            expect(store.hasModule('device')).toBe(true);
            expect(store.hasModule('blog')).toBe(true);
            expect(store.hasModule('user')).toBe(true);
            expect(store.hasModule('map')).toBe(true);
            expect(store.hasModule('sdp')).toBe(true);
            expect(store.hasModule('searchPortal')).toBe(true);
            expect(store.hasModule('bookingPortal')).toBe(true);
            expect(store.hasModule('config')).toBe(true);
            expect(store.hasModule('registerRequest')).toBe(true);
            expect(store.hasModule('spotRequests')).toBe(true);
            expect(store.hasModule('reviewSpot')).toBe(true);
            expect(store.hasModule('kycStatusPortal')).toBe(true);
            expect(store.hasModule('myBookings')).toBe(true);
            expect(store.hasModule('pendingPayments')).toBe(true);
            expect(store.hasModule('app')).toBe(true);
            // SSG: `seoPages` backs the prerendered area pages and is the
            // hand-off bucket between `serverPrefetch` and client hydration.
            expect(store.hasModule('seoPages')).toBe(true);
        });
    });

    describe('Behavior tests', () => {
        it('exposes state for the core modules used by the app shell', () => {
            expect(store.state).toHaveProperty('user');
            expect(store.state).toHaveProperty('config');
            expect(store.state).toHaveProperty('pendingPayments');
            expect(store.state).toHaveProperty('app');
        });
    });

    describe('Accessibility tests', () => {
        it('provides user state flags needed by navigation and route guards', () => {
            expect(store.state.user).toHaveProperty('isAuthReady');
            expect(store.state.user).toHaveProperty('isAdmin');
            expect(store.state.user).toHaveProperty('isAgent');
        });
    });

    describe('Focused snapshot tests', () => {
        it('matches the registered module key snapshot', () => {
            // Modules are registered in alphabetical order by
            // `createAppStore` so module additions stay visually local.
            expect(Object.keys(store.state).sort()).toMatchInlineSnapshot(`
              [
                "app",
                "blog",
                "bookingPortal",
                "config",
                "device",
                "kycStatusPortal",
                "map",
                "myBookings",
                "pendingPayments",
                "registerRequest",
                "reviewSpot",
                "sdp",
                "searchPortal",
                "seoPages",
                "spotRequests",
                "spotSearch",
                "user",
              ]
            `);
        });
    });

    describe('seedAppStore — single-instance contract', () => {
        it('exports seedAppStore and __resetAppStoreSingletonForTests', async () => {
            const mod = await import('@/store');
            expect(typeof mod.seedAppStore).toBe('function');
            expect(typeof mod.__resetAppStoreSingletonForTests).toBe(
                'function',
            );
            expect(typeof mod.createAppStore).toBe('function');
        });

        it('default-export commits and seeded-instance commits target the same store', async () => {
            const {
                createAppStore,
                seedAppStore,
                __resetAppStoreSingletonForTests,
                default: defaultStore,
            } = await import('@/store');
            __resetAppStoreSingletonForTests();

            const canonical = createAppStore();
            seedAppStore(canonical);

            canonical.commit('user/update-auth-ready', true);
            expect(defaultStore.state.user.isAuthReady).toBe(true);

            __resetAppStoreSingletonForTests();
            const canonical2 = createAppStore();
            seedAppStore(canonical2);
            defaultStore.commit('user/update-auth-ready', true);
            expect(canonical2.state.user.isAuthReady).toBe(true);

            __resetAppStoreSingletonForTests();
        });

        it('falls back to a lazily-built store when no seed has happened', async () => {
            const {
                __resetAppStoreSingletonForTests,
                default: defaultStore,
            } = await import('@/store');
            __resetAppStoreSingletonForTests();

            expect(defaultStore.state).toBeDefined();
            expect(defaultStore.state.user).toHaveProperty('isAuthReady');
        });

        it('reseeding swaps the instance the Proxy resolves to', async () => {
            const {
                createAppStore,
                seedAppStore,
                __resetAppStoreSingletonForTests,
                default: defaultStore,
            } = await import('@/store');
            __resetAppStoreSingletonForTests();

            const a = createAppStore();
            const b = createAppStore();
            seedAppStore(a);
            a.commit('user/update-auth-ready', true);
            expect(defaultStore.state.user.isAuthReady).toBe(true);

            seedAppStore(b);
            expect(defaultStore.state.user.isAuthReady).toBe(false);

            __resetAppStoreSingletonForTests();
        });
    });
});
