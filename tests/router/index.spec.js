import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createRouter, createMemoryHistory } from 'vue-router';
import { routes } from '@/router/routes';

vi.mock('firebase/auth', () => ({
    onAuthStateChanged: vi.fn(),
    signOut: vi.fn(),
    GoogleAuthProvider: vi.fn(),
    signInWithPopup: vi.fn(),
}));

vi.mock('@/store', () => ({
    default: {
        state: {
            user: {
                user: null,
                isAgent: false,
                isAdmin: false,
            },
        },
        commit: vi.fn(),
        dispatch: vi.fn(),
    },
}));

const createTestRouter = () =>
    createRouter({
        history: createMemoryHistory(),
        routes,
        scrollBehavior: (_to, _from, savedPosition) => {
            if (savedPosition) {
                return savedPosition;
            } else {
                return { top: 0, behavior: 'smooth' };
            }
        },
    });

describe('Router Instance', () => {
    let router;

    beforeEach(async () => {
        router = createTestRouter();
        await router.push('/');
        await router.isReady();
    });

    describe('Router Setup', () => {
        it('should create router instance', () => {
            expect(router).toBeDefined();
        });

        it('should contain all routes', () => {
            const routerRoutes = router.getRoutes();
            expect(routerRoutes.length).toBeGreaterThan(0);
        });
    });

    describe('Scroll Behavior', () => {
        it('should return saved position if available', () => {
            const savedPosition = { top: 100 };
            const result = router.options.scrollBehavior({}, {}, savedPosition);

            expect(result).toEqual(savedPosition);
        });

        it('should scroll to top if no saved position', () => {
            const result = router.options.scrollBehavior({}, {}, null);

            expect(result).toEqual({
                top: 0,
                behavior: 'smooth',
            });
        });
    });

    describe('Navigation', () => {
        it('should navigate to home route', async () => {
            await router.push('/');
            expect(router.currentRoute.value.path).toBe('/');
        });

        it('should resolve dynamic route correctly', () => {
            const route = router.resolve('/spot-details/123');
            expect(route.params.spotId).toBe('123');
        });
    });
});
