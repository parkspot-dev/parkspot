import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Isolated mocks so we can drive `handleAuthStateChanged` directly.
vi.mock('@/store', () => ({
    default: {
        commit: vi.fn(),
        dispatch: vi.fn().mockResolvedValue(),
        state: { user: {} },
    },
}));
vi.mock('@/services/api', () => ({
    mayaClient: { get: vi.fn(), post: vi.fn(), patch: vi.fn() },
}));
vi.mock('@/lib/analytics', () => ({
    identify: vi.fn(),
    setUserProperty: vi.fn(),
}));
vi.mock('@/lib/analytics/attribution', () => ({
    formatRemarkWithUtm: (s) => s,
}));
vi.mock('@/utils/logger', () => ({
    logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), event: vi.fn() },
}));
vi.mock('firebase/auth', () => ({
    onAuthStateChanged: vi.fn(),
    signInWithPopup: vi.fn(),
    GoogleAuthProvider: vi.fn(),
    signOut: vi.fn(),
}));
vi.mock('@/firebase', () => ({ auth: { currentUser: null } }));

import store from '@/store';
import { handleAuthStateChanged } from '@/store/user';
import { identify, setUserProperty } from '@/lib/analytics';
import { logger } from '@/utils/logger';

const flush = () => new Promise((r) => setTimeout(r, 0));

describe('handleAuthStateChanged', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        store.state = { user: {} };
        store.dispatch.mockResolvedValue();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('signed-out: resets user, clears token, marks auth ready', async () => {
        localStorage.setItem('PSAuthKey', 'stale');

        await handleAuthStateChanged(null);

        expect(store.commit).toHaveBeenCalledWith('user/update-user', null);
        expect(store.commit).toHaveBeenCalledWith('user/update-auth-progress', {
            authReady: true,
            roleResolved: false,
        });
        expect(setUserProperty).toHaveBeenCalledWith('is_authenticated', false);
        expect(localStorage.getItem('PSAuthKey')).toBeNull();
        expect(store.dispatch).not.toHaveBeenCalledWith('user/getUserProfile');
    });

    it('signed-out: reports the role as unresolved, not resolved-and-false', async () => {
        // A signed-out session has no role at all. Claiming `roleResolved:
        // true` here would let a guard trust the previous user's verdict.
        await handleAuthStateChanged(null);

        expect(store.commit).toHaveBeenCalledWith('user/update-auth-progress', {
            authReady: true,
            roleResolved: false,
        });
    });

    it('signed-in: marks auth ready and stores the token', async () => {
        const user = {
            uid: 'u1',
            getIdToken: vi.fn().mockResolvedValue('id-token'),
        };

        await handleAuthStateChanged(user);
        await flush();

        expect(store.commit).toHaveBeenCalledWith('user/update-user', user);
        expect(store.commit).toHaveBeenCalledWith('user/update-auth-progress', {
            authReady: true,
            roleResolved: false,
        });
        expect(localStorage.getItem('PSAuthKey')).toBe('id-token');
        expect(store.dispatch).toHaveBeenCalledWith('user/getUserProfile');
        // `/auth/user/agents` is an internal CRM endpoint that 401/403s for
        // regular customers; firing it here caused a bogus "session expired"
        // alert right after login. The auth bootstrap must not request it.
        expect(store.dispatch).not.toHaveBeenCalledWith('app/getAgents');
        expect(identify).toHaveBeenCalled();
    });

    it('flips auth-ready even while the profile load is still pending (non-blocking)', async () => {
        // getUserProfile never settles: the old code would never reach the
        // update-auth-progress commit. The fix must commit it regardless.
        store.dispatch.mockImplementation((action) =>
            action === 'user/getUserProfile'
                ? new Promise(() => {})
                : Promise.resolve(),
        );
        const user = {
            uid: 'u2',
            getIdToken: vi.fn().mockResolvedValue('id-token'),
        };

        await handleAuthStateChanged(user);

        expect(store.commit).toHaveBeenCalledWith('user/update-auth-progress', {
            authReady: true,
            roleResolved: false,
        });
        expect(store.dispatch).toHaveBeenCalledWith('user/getUserProfile');
    });

    it('signed-in with empty token: warns, marks ready, skips profile load', async () => {
        const user = {
            uid: 'u3',
            getIdToken: vi.fn().mockResolvedValue(''),
        };

        await handleAuthStateChanged(user);

        expect(logger.warn).toHaveBeenCalled();
        expect(store.commit).toHaveBeenCalledWith(
            'user/set-auth-error',
            expect.objectContaining({ source: 'onAuthStateChanged' }),
        );
        expect(store.commit).toHaveBeenCalledWith('user/update-auth-progress', {
            authReady: true,
            roleResolved: false,
        });
        expect(store.dispatch).not.toHaveBeenCalledWith('user/getUserProfile');
    });

    it('signed-in but getIdToken hangs: still marks auth ready after the timeout', async () => {
        vi.useFakeTimers();
        const user = {
            uid: 'u4',
            getIdToken: vi.fn(() => new Promise(() => {})),
        };

        const pending = handleAuthStateChanged(user);
        await vi.advanceTimersByTimeAsync(5000);
        await pending;

        expect(store.commit).toHaveBeenCalledWith('user/update-auth-progress', {
            authReady: true,
            roleResolved: false,
        });
        // Hung token → treated as empty → no profile fetch, but never hangs.
        expect(store.dispatch).not.toHaveBeenCalledWith('user/getUserProfile');
    });

    it('surfaces an auth error if background bootstrap rejects', async () => {
        store.dispatch.mockImplementation((action) =>
            action === 'user/getUserProfile'
                ? Promise.reject(new Error('maya down'))
                : Promise.resolve(),
        );
        const user = {
            uid: 'u5',
            getIdToken: vi.fn().mockResolvedValue('id-token'),
        };

        await handleAuthStateChanged(user);
        await flush();

        expect(store.commit).toHaveBeenCalledWith('user/update-auth-progress', {
            authReady: true,
            roleResolved: true,
        });
        expect(store.commit).toHaveBeenCalledWith(
            'user/set-auth-error',
            expect.objectContaining({
                source: 'onAuthStateChanged',
                message: 'Failed to load user bootstrap data',
            }),
        );
    });

    it('resolves the role even when the profile fetch rejects', async () => {
        // The role verdict is settled by the time `bootstrapUserData` settles,
        // whatever happened along the way. If this did not commit
        // `roleResolved: true`, the pending-payments guard would sit waiting
        // until its timeout and then bounce the user to Home.
        store.dispatch.mockImplementation((action) =>
            action === 'user/getUserProfile'
                ? Promise.reject(new Error('maya down'))
                : Promise.resolve(),
        );
        const user = {
            uid: 'u6',
            getIdToken: vi.fn().mockResolvedValue('id-token'),
        };

        await handleAuthStateChanged(user);
        await flush();

        expect(store.commit).toHaveBeenCalledWith('user/update-auth-progress', {
            authReady: true,
            roleResolved: true,
        });
    });

    it('leaves the role unresolved while the profile load is still pending', async () => {
        // The whole point of the non-blocking bootstrap: auth is ready, but we
        // must NOT claim the role is resolved until `getUserProfile` settles.
        store.dispatch.mockImplementation((action) =>
            action === 'user/getUserProfile'
                ? new Promise(() => {})
                : Promise.resolve(),
        );
        const user = {
            uid: 'u7',
            getIdToken: vi.fn().mockResolvedValue('id-token'),
        };

        await handleAuthStateChanged(user);
        await flush();

        expect(store.commit).not.toHaveBeenCalledWith(
            'user/update-auth-progress',
            { authReady: true, roleResolved: true },
        );
    });
});
