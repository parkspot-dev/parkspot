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
            expect(Object.keys(store.state)).toMatchInlineSnapshot(`
              [
                "device",
                "blog",
                "user",
                "map",
                "sdp",
                "searchPortal",
                "bookingPortal",
                "config",
                "registerRequest",
                "spotRequests",
                "reviewSpot",
                "kycStatusPortal",
                "myBookings",
                "pendingPayments",
                "app",
              ]
            `);
        });
    });
});
