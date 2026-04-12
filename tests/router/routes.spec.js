import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockedStore = vi.hoisted(() => ({
    state: {
        user: {
            isAuthReady: true,
            user: null,
            isAdmin: false,
        },
    },
    watch: vi.fn(),
    commit: vi.fn(),
}));

vi.mock('@/store', () => ({
    default: mockedStore,
}));

import { routes } from '@/router/routes.js';

describe('pending-payments route guard', () => {
    const pendingPaymentsRoute = routes.find(
        (route) => route.name === 'pending-payments',
    );

    beforeEach(() => {
        vi.useRealTimers();
        mockedStore.state.user = {
            isAuthReady: true,
            user: null,
            isAdmin: false,
        };
        vi.clearAllMocks();
    });

    it('waits for auth readiness before deciding navigation', async () => {
        mockedStore.state.user = {
            isAuthReady: false,
            user: null,
            isAdmin: false,
        };

        const unwatch = vi.fn();
        let watchCallback;

        mockedStore.watch.mockImplementation((_selector, callback) => {
            watchCallback = callback;
            return unwatch;
        });

        const next = vi.fn();
        const to = { fullPath: '/internal/pending-payments' };

        let resolved = false;
        const guardPromise = pendingPaymentsRoute.beforeEnter(to, {}, next).then(
            () => {
                resolved = true;
            },
        );

        await Promise.resolve();

        expect(mockedStore.watch).toHaveBeenCalledTimes(1);
        expect(next).not.toHaveBeenCalled();
        expect(resolved).toBe(false);

        mockedStore.state.user.isAuthReady = true;
        watchCallback(true);
        await guardPromise;

        expect(unwatch).toHaveBeenCalledTimes(1);
    });

    it('stops waiting after timeout and redirects to Home', async () => {
        vi.useFakeTimers();

        mockedStore.state.user = {
            isAuthReady: false,
            user: null,
            isAdmin: false,
        };

        const unwatch = vi.fn();

        mockedStore.watch.mockImplementation(() => unwatch);

        const next = vi.fn();
        const to = { fullPath: '/internal/pending-payments' };

        const guardPromise = pendingPaymentsRoute.beforeEnter(to, {}, next);

        await vi.advanceTimersByTimeAsync(5000);
        await guardPromise;

        expect(unwatch).toHaveBeenCalledTimes(1);
        expect(mockedStore.commit).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith({ name: 'Home' });
    });

    it('redirects unauthenticated users to Home and keeps redirect query', async () => {
        mockedStore.state.user = {
            isAuthReady: true,
            user: null,
            isAdmin: false,
        };

        const next = vi.fn();
        const to = { fullPath: '/internal/pending-payments?page=2' };

        await pendingPaymentsRoute.beforeEnter(to, {}, next);

        expect(mockedStore.commit).toHaveBeenCalledWith(
            'user/update-login-modal',
            true,
        );
        expect(next).toHaveBeenCalledWith({
            name: 'Home',
            query: { redirect: '/internal/pending-payments?page=2' },
        });
    });

    it('redirects logged-in non-admin users to Home', async () => {
        mockedStore.state.user = {
            isAuthReady: true,
            user: { uid: 'abc' },
            isAdmin: false,
        };

        const next = vi.fn();

        await pendingPaymentsRoute.beforeEnter(
            { fullPath: '/internal/pending-payments' },
            {},
            next,
        );

        expect(next).toHaveBeenCalledWith({ name: 'Home' });
    });

    it('allows logged-in admin users', async () => {
        mockedStore.state.user = {
            isAuthReady: true,
            user: { uid: 'admin-1' },
            isAdmin: true,
        };

        const next = vi.fn();

        await pendingPaymentsRoute.beforeEnter(
            { fullPath: '/internal/pending-payments' },
            {},
            next,
        );

        expect(next).toHaveBeenCalledWith();
    });
});
