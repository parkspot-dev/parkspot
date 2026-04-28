import { beforeEach, describe, expect, it, vi } from 'vitest';
import { APP_LINK } from '@/constant/constant';

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

import { pages, routes } from '@/router/routes';

describe('routes', () => {
    const pendingPaymentsRoute = routes.find(
        (route) => route.name === 'pending-payments',
    );
    const appRoute = routes.find((route) => route.name === 'App');
    const redirectRoute = routes.find(
        (route) => route.path === '/search-portal',
    );

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useRealTimers();

        mockedStore.state.user = {
            isAuthReady: true,
            user: null,
            isAdmin: false,
        };

        Object.defineProperty(window.navigator, 'userAgent', {
            configurable: true,
            value: 'Mozilla/5.0',
        });

        Object.defineProperty(window, 'location', {
            configurable: true,
            value: {
                href: 'https://parkspot.test',
            },
        });
    });

    describe('Structure tests', () => {
        it('defines the pending payments route with the expected path', () => {
            expect(pendingPaymentsRoute).toBeDefined();
            expect(pendingPaymentsRoute).toHaveProperty(
                'path',
                pages.PENDING_PAYMENTS,
            );
        });

        it('defines the temporary redirect route with the exact target', () => {
            expect(redirectRoute).toBeDefined();
            expect(redirectRoute).toHaveProperty(
                'redirect',
                '/internal/search-portal',
            );
        });
    });

    describe('Behavior tests', () => {
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
            const guardPromise = pendingPaymentsRoute
                .beforeEnter(to, {}, next)
                .then(() => {
                    resolved = true;
                });

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
            expect(next).toHaveBeenCalledWith({ name: 'Home' });
        });

        it('redirects unauthenticated users to Home and preserves the redirect query', async () => {
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

        it('redirects Android users to the Android app link', () => {
            Object.defineProperty(window.navigator, 'userAgent', {
                configurable: true,
                value: 'Mozilla/5.0 (Linux; Android 14)',
            });

            const next = vi.fn();

            appRoute.beforeEnter({}, {}, next);

            expect(window.location.href).toBe(APP_LINK.ANDROID);
            expect(next).toHaveBeenCalledWith();
        });

        it('redirects iPhone users to the iOS app link', () => {
            Object.defineProperty(window.navigator, 'userAgent', {
                configurable: true,
                value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
            });

            const next = vi.fn();

            appRoute.beforeEnter({}, {}, next);

            expect(window.location.href).toBe(APP_LINK.IOS);
            expect(next).toHaveBeenCalledWith();
        });

        it('keeps desktop users on the web route', () => {
            const next = vi.fn();

            appRoute.beforeEnter({}, {}, next);

            expect(window.location.href).toBe('https://parkspot.test');
            expect(next).toHaveBeenCalledWith();
        });
    });

    describe('Accessibility tests', () => {
        it('exposes stable route names for navigation consumers', () => {
            expect(pendingPaymentsRoute).toHaveProperty(
                'name',
                'pending-payments',
            );
            expect(appRoute).toHaveProperty('name', 'App');
        });
    });

    describe('Focused snapshot tests', () => {
        it('matches the focused route snapshot', () => {
            expect([
                {
                    name: pendingPaymentsRoute.name,
                    path: pendingPaymentsRoute.path,
                },
                {
                    name: appRoute.name,
                    path: appRoute.path,
                },
                {
                    path: redirectRoute.path,
                    redirect: redirectRoute.redirect,
                },
            ]).toMatchInlineSnapshot(`
              [
                {
                  "name": "pending-payments",
                  "path": "/internal/pending-payments",
                },
                {
                  "name": "App",
                  "path": "/app",
                },
                {
                  "path": "/search-portal",
                  "redirect": "/internal/search-portal",
                },
              ]
            `);
        });
    });
});
