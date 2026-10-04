// Firebase calls this listener with no `.catch`, so a throw anywhere in
// it used to become an unhandled rejection. It's now wrapped in try/catch.
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { storeMock, telemetryMock } = vi.hoisted(() => ({
    storeMock: {
        state: { user: { user: null } },
        commit: vi.fn(),
        dispatch: vi.fn().mockResolvedValue(undefined),
    },
    telemetryMock: {
        clearUser: vi.fn(),
        reportError: vi.fn(),
        setUser: vi.fn(),
    },
}));

let capturedAuthCallback = null;

vi.mock('@/firebase', () => ({
    auth: {},
}));

vi.mock('@/store', () => ({
    default: storeMock,
}));

vi.mock('firebase/auth', async () => {
    const actual = await vi.importActual('firebase/auth');
    return {
        ...actual,
        onAuthStateChanged: vi.fn((_auth, callback) => {
            capturedAuthCallback = callback;
            return () => undefined;
        }),
        signInWithPopup: vi.fn(),
        signOut: vi.fn(),
    };
});

vi.mock('@/lib/analytics', () => ({
    identify: vi.fn(),
    setUserProperty: vi.fn(),
}));

vi.mock('@/telemetry', async (importOriginal) => ({
    ...(await importOriginal()),
    ...telemetryMock,
}));

vi.mock('@/lib/analytics/attribution', () => ({
    formatRemarkWithUtm: (remark) => remark,
}));

vi.mock('@/services/api', () => ({
    mayaClient: { get: vi.fn(), post: vi.fn(), patch: vi.fn() },
}));

const makeFirebaseUser = (overrides = {}) => ({
    uid: 'user-123',
    getIdToken: vi.fn().mockResolvedValue('id-token'),
    ...overrides,
});

describe('store/user onAuthStateChanged listener', () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        localStorage.clear();
        capturedAuthCallback = null;
        storeMock.state = { user: { user: null } };
        storeMock.commit = vi.fn();
        storeMock.dispatch = vi.fn().mockResolvedValue(undefined);

        vi.resetModules();
        await import('@/store/user');
        expect(capturedAuthCallback).toBeTypeOf('function');
    });

    it('does not reject and logs instead when a mutation throws mid-callback', async () => {
        const consoleErrorSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => undefined);
        storeMock.commit.mockImplementationOnce(() => {
            throw new Error('stale store binding');
        });

        await expect(
            capturedAuthCallback(makeFirebaseUser()),
        ).resolves.toBeUndefined();

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'onAuthStateChanged listener failed',
            expect.any(Error),
        );
        expect(telemetryMock.reportError).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'stale store binding' }),
            { source: 'auth_listener' },
        );
    });

    it('signs the user in: commits the user, fetches the profile, marks auth ready', async () => {
        const user = makeFirebaseUser();

        await capturedAuthCallback(user);

        expect(storeMock.commit).toHaveBeenCalledWith('user/update-user', user);
        expect(storeMock.dispatch).toHaveBeenCalledWith('user/getUserProfile');
        expect(storeMock.commit).toHaveBeenCalledWith(
            'user/update-auth-ready',
            true,
        );
        expect(localStorage.getItem('PSAuthKey')).toBe('id-token');
        expect(telemetryMock.setUser).toHaveBeenCalledWith('user-123', {
            role: 'unknown',
        });
    });

    it('signs the user out: clears the token and does not touch the profile fetch', async () => {
        localStorage.setItem('PSAuthKey', 'stale-token');

        await capturedAuthCallback(null);

        expect(storeMock.commit).toHaveBeenCalledWith('user/update-user', null);
        expect(storeMock.commit).toHaveBeenCalledWith(
            'user/set-auth-error',
            null,
        );
        expect(storeMock.dispatch).not.toHaveBeenCalled();
        expect(localStorage.getItem('PSAuthKey')).toBeNull();
        expect(storeMock.commit).toHaveBeenCalledWith(
            'user/update-auth-ready',
            true,
        );
        expect(telemetryMock.clearUser).toHaveBeenCalledTimes(1);
        expect(telemetryMock.setUser).not.toHaveBeenCalled();
    });

    it('records an auth error (without throwing) when the profile fetch fails', async () => {
        storeMock.dispatch.mockRejectedValueOnce(new Error('maya down'));

        await expect(
            capturedAuthCallback(makeFirebaseUser()),
        ).resolves.toBeUndefined();

        expect(storeMock.commit).toHaveBeenCalledWith('user/set-auth-error', {
            source: 'onAuthStateChanged',
            message: 'Failed to load user bootstrap data',
        });
        expect(storeMock.commit).toHaveBeenCalledWith(
            'user/update-auth-ready',
            true,
        );
        expect(telemetryMock.reportError).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'maya down' }),
            { source: 'auth_bootstrap' },
        );
        expect(telemetryMock.setUser).not.toHaveBeenCalled();
    });

    it('resolves the previous-user cache key safely when store.state.user is absent', async () => {
        storeMock.state = {};

        await expect(
            capturedAuthCallback(makeFirebaseUser()),
        ).resolves.toBeUndefined();

        expect(storeMock.commit).toHaveBeenCalledWith(
            'user/update-auth-ready',
            true,
        );
    });
});
