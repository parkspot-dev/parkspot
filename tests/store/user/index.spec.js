import { describe, it, expect, vi, beforeEach } from 'vitest';
import userModule from '@/store/user';
import { UserType } from '@/constant/enums';
import { mayaClient } from '@/services/api';
import { signOut } from 'firebase/auth';

vi.mock('@/store', () => ({
    default: {
        commit: vi.fn(),
    },
}));

vi.mock('@/services/api', () => ({
    mayaClient: {
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
    },
}));

vi.mock('firebase/auth', async () => {
    const actual = await vi.importActual('firebase/auth');

    return {
        ...actual,
        signOut: vi.fn().mockResolvedValue(),
    };
});

describe('User Store - Agent Auth Fix', () => {
    let commit;
    let dispatch;

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();

        commit = vi.fn();
        const dispatchMock = vi.fn();
        dispatch = new Proxy(dispatchMock, {
            apply(target, thisArg, args) {
                const [action, payload, options] = args;
                return Reflect.apply(target, thisArg, [
                    action,
                    payload == null ? {} : payload,
                    options == null ? {} : options,
                ]);
            },
        });
    });

    it('authenticateWithMaya commits set-user-type when userType is Agent', async () => {
        localStorage.setItem('PSAuthKey', 'token');

        mayaClient.get.mockResolvedValue({
            UserType: UserType.Agent,
        });

        await userModule.actions.authenticateWithMaya({ commit });

        expect(mayaClient.get).toHaveBeenCalledWith('/auth/authenticate');
        expect(commit).toHaveBeenCalledWith('set-user-type', UserType.Agent);
    });

    it('authenticateWithMaya does nothing if UserType is missing', async () => {
        localStorage.setItem('PSAuthKey', 'token');

        mayaClient.get.mockResolvedValue({});

        await userModule.actions.authenticateWithMaya({ commit });

        expect(mayaClient.get).toHaveBeenCalledWith('/auth/authenticate');
        expect(commit).not.toHaveBeenCalledWith(
            'set-user-type',
            expect.anything(),
        );
    });

    it('authenticateWithMaya does not call API when PSAuthKey is invalid', async () => {
        localStorage.setItem('PSAuthKey', 'undefined');

        await userModule.actions.authenticateWithMaya({ commit });

        expect(mayaClient.get).not.toHaveBeenCalled();
        expect(commit).toHaveBeenCalledWith('set-auth-error', {
            source: 'authenticateWithMaya',
            message: 'Missing PS auth key',
        });
        expect(commit).not.toHaveBeenCalledWith(
            'set-user-type',
            expect.anything(),
        );
    });

    it('authenticateWithMaya does not call API when PSAuthKey is the string null', async () => {
        localStorage.setItem('PSAuthKey', ' null ');

        await userModule.actions.authenticateWithMaya({ commit });

        expect(mayaClient.get).not.toHaveBeenCalled();
        expect(commit).toHaveBeenCalledWith('set-auth-error', {
            source: 'authenticateWithMaya',
            message: 'Missing PS auth key',
        });
    });

    it('getUserProfile sets user type when profile has Type', async () => {
        localStorage.setItem('PSAuthKey', 'token');

        mayaClient.get.mockResolvedValue({
            FullName: 'Dev Shrivastav',
            Type: UserType.Agent,
        });

        await userModule.actions.getUserProfile({
            commit,
            dispatch,
        });

        expect(mayaClient.get).toHaveBeenCalledWith('/auth/user');
        expect(commit).toHaveBeenCalledWith(
            'update-user-profile',
            expect.objectContaining({
                FullName: 'Dev Shrivastav',
                Type: UserType.Agent,
            }),
        );

        expect(commit).toHaveBeenCalledWith('set-user-type', UserType.Agent);
        expect(dispatch).not.toHaveBeenCalledWith(
            'authenticateWithMaya',
            expect.anything(),
            expect.anything(),
        );
    });

    it('getUserProfile falls back to authenticateWithMaya when Type is missing', async () => {
        localStorage.setItem('PSAuthKey', 'token');

        mayaClient.get.mockResolvedValue({
            FullName: 'Dev Shrivastav',
        });

        await userModule.actions.getUserProfile({
            commit,
            dispatch,
        });

        expect(mayaClient.get).toHaveBeenCalledWith('/auth/user');
        expect(commit).toHaveBeenCalledWith(
            'update-user-profile',
            expect.objectContaining({
                FullName: 'Dev Shrivastav',
            }),
        );
        expect(commit).not.toHaveBeenCalledWith(
            'set-user-type',
            expect.anything(),
        );
        expect(dispatch).toHaveBeenCalledWith(
            'authenticateWithMaya',
            expect.anything(),
            expect.anything(),
        );
    });

    it('getUserProfile falls back to authenticateWithMaya when API fails', async () => {
        localStorage.setItem('PSAuthKey', 'token');

        mayaClient.get.mockRejectedValue(new Error('API failed'));

        await userModule.actions.getUserProfile({
            commit,
            dispatch,
        });

        expect(mayaClient.get).toHaveBeenCalledWith('/auth/user');
        expect(dispatch).toHaveBeenCalledWith(
            'authenticateWithMaya',
            expect.anything(),
            expect.anything(),
        );
        expect(commit).not.toHaveBeenCalledWith(
            'update-user-profile',
            expect.anything(),
        );
        expect(commit).not.toHaveBeenCalledWith(
            'set-user-type',
            expect.anything(),
        );
    });

    it('getUserProfile does not call API when PSAuthKey is invalid', async () => {
        localStorage.setItem('PSAuthKey', 'undefined');

        await userModule.actions.getUserProfile({
            commit,
            dispatch,
        });

        expect(mayaClient.get).not.toHaveBeenCalled();
        expect(commit).toHaveBeenCalledWith('set-auth-error', {
            source: 'getUserProfile',
            message: 'Missing PS auth key',
        });
        expect(dispatch).not.toHaveBeenCalledWith(
            'authenticateWithMaya',
            expect.anything(),
            expect.anything(),
        );
        expect(commit).not.toHaveBeenCalledWith(
            'update-user-profile',
            expect.anything(),
        );
        expect(commit).not.toHaveBeenCalledWith(
            'set-user-type',
            expect.anything(),
        );
    });

    it('getUserProfile does not call API when PSAuthKey is blank whitespace', async () => {
        localStorage.setItem('PSAuthKey', '   ');

        await userModule.actions.getUserProfile({
            commit,
            dispatch,
        });

        expect(mayaClient.get).not.toHaveBeenCalled();
        expect(commit).toHaveBeenCalledWith('set-auth-error', {
            source: 'getUserProfile',
            message: 'Missing PS auth key',
        });
        expect(dispatch).not.toHaveBeenCalledWith(
            'authenticateWithMaya',
            expect.anything(),
            expect.anything(),
        );
    });

    it('getUserProfile uses cache when valid', async () => {
        localStorage.setItem('PSAuthKey', 'token');

        const cached = {
            FullName: 'Dev Shrivastav',
            Type: UserType.Agent,
        };
        const state = { user: { uid: 'agent_user' } };

        localStorage.setItem(
            'profile:agent_user',
            JSON.stringify({
                version: 1,
                savedAt: Date.now(),
                data: cached,
            }),
        );

        mayaClient.get.mockResolvedValue({
            FullName: 'Dev Shrivastav',
            Type: UserType.Agent,
        });

        await userModule.actions.getUserProfile({
            commit,
            dispatch,
            state,
        });

        expect(mayaClient.get).not.toHaveBeenCalled();
        expect(dispatch).not.toHaveBeenCalledWith(
            'authenticateWithMaya',
            expect.anything(),
            expect.anything(),
        );
        expect(commit).toHaveBeenCalledWith(
            'update-user-profile',
            expect.objectContaining({
                FullName: 'Dev Shrivastav',
                Type: UserType.Agent,
            }),
        );
        expect(commit).toHaveBeenCalledWith('set-auth-error', null);
        expect(commit).toHaveBeenCalledWith('set-user-type', UserType.Agent);
        expect(commit).toHaveBeenCalledTimes(3);
    });

    it('getUserProfile ignores cached profile without Type and falls back to authenticateWithMaya', async () => {
        localStorage.setItem('PSAuthKey', 'token');
        const state = { user: { uid: 'agent_user' } };

        localStorage.setItem(
            'profile:agent_user',
            JSON.stringify({
                version: 1,
                savedAt: Date.now(),
                data: { FullName: 'Dev Shrivastav Cached' },
            }),
        );

        mayaClient.get.mockResolvedValue({
            FullName: 'Dev Shrivastav Fresh',
        });

        await userModule.actions.getUserProfile({
            commit,
            dispatch,
            state,
        });

        expect(mayaClient.get).toHaveBeenCalledWith('/auth/user');
        expect(commit).toHaveBeenCalledWith(
            'update-user-profile',
            expect.objectContaining({
                FullName: 'Dev Shrivastav Fresh',
            }),
        );
        expect(commit).not.toHaveBeenCalledWith(
            'update-user-profile',
            expect.objectContaining({
                FullName: 'Dev Shrivastav Cached',
            }),
        );
        expect(commit).not.toHaveBeenCalledWith(
            'set-user-type',
            expect.anything(),
        );
        expect(dispatch).toHaveBeenCalledWith(
            'authenticateWithMaya',
            expect.anything(),
            expect.anything(),
        );
    });

    it('getUserProfile calls API when cache expired', async () => {
        localStorage.setItem('PSAuthKey', 'token');
        const state = { user: { uid: 'agent_user' } };

        localStorage.setItem(
            'profile:agent_user',
            JSON.stringify({
                version: 1,
                savedAt: Date.now() - 25 * 60 * 60 * 1000,
                data: { FullName: 'Dev Shrivastav Old' },
            }),
        );

        mayaClient.get.mockResolvedValue({
            FullName: 'Dev Shrivastav Fresh',
            Type: UserType.Agent,
        });

        await userModule.actions.getUserProfile({
            commit,
            dispatch,
            state,
        });

        expect(mayaClient.get).toHaveBeenCalledWith('/auth/user');
        expect(dispatch).not.toHaveBeenCalledWith(
            'authenticateWithMaya',
            expect.anything(),
            expect.anything(),
        );
        expect(commit).toHaveBeenCalledWith(
            'update-user-profile',
            expect.objectContaining({
                FullName: 'Dev Shrivastav Fresh',
                Type: UserType.Agent,
            }),
        );
        expect(commit).toHaveBeenCalledWith('set-auth-error', null);
        expect(commit).toHaveBeenCalledWith('set-user-type', UserType.Agent);
        expect(commit).toHaveBeenCalledTimes(3);
        expect(commit).not.toHaveBeenCalledWith(
            'update-user-profile',
            expect.objectContaining({
                FullName: 'Dev Shrivastav Old',
            }),
        );
    });

    it('getUserProfile ignores corrupted cache and calls API', async () => {
        localStorage.setItem('PSAuthKey', 'token');
        const state = { user: { uid: 'agent_user' } };

        localStorage.setItem('profile:agent_user', 'invalid-json');

        mayaClient.get.mockResolvedValue({
            FullName: 'Dev Shrivastav Fresh',
            Type: UserType.Agent,
        });

        await userModule.actions.getUserProfile({
            commit,
            dispatch,
            state,
        });

        expect(mayaClient.get).toHaveBeenCalledWith('/auth/user');
        expect(dispatch).not.toHaveBeenCalledWith(
            'authenticateWithMaya',
            expect.anything(),
            expect.anything(),
        );
        expect(commit).toHaveBeenCalledWith(
            'update-user-profile',
            expect.objectContaining({
                FullName: 'Dev Shrivastav Fresh',
                Type: UserType.Agent,
            }),
        );
        expect(commit).toHaveBeenCalledWith('set-auth-error', null);
        expect(commit).toHaveBeenCalledWith('set-user-type', UserType.Agent);
        expect(commit).toHaveBeenCalledTimes(3);
    });

    it('logOut resets user and userProfile', async () => {
        await userModule.actions.logOut({
            commit,
            dispatch,
            state: { user: { uid: 'agent_user' } },
        });

        expect(signOut).toHaveBeenCalled();
        expect(dispatch).toHaveBeenCalledWith(
            'app/clearAgents',
            expect.anything(),
            expect.objectContaining({ root: true }),
        );
        expect(commit).toHaveBeenCalledWith('update-user', null);
        expect(commit).toHaveBeenCalledWith('reset-user-profile');
    });

    it('does not write profile cache when Type is missing', async () => {
        localStorage.setItem('PSAuthKey', 'token');

        const state = { user: { uid: 'agent_user' } };
        const userProfile = { FullName: 'Dev Shrivastav' };
        const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

        mayaClient.get.mockResolvedValue(userProfile);

        await userModule.actions.getUserProfile({
            commit,
            dispatch,
            state,
        });

        expect(mayaClient.get).toHaveBeenCalledWith('/auth/user');
        expect(setItemSpy).not.toHaveBeenCalledWith(
            'profile:agent_user',
            expect.any(String),
        );
        expect(localStorage.getItem('profile:agent_user')).toBeNull();
        expect(dispatch).toHaveBeenCalledWith(
            'authenticateWithMaya',
            expect.anything(),
            expect.anything(),
        );
    });

    describe('User Store - Missing Coverage (Added)', () => {
        it('authenticateWithMaya throws error when API fails', async () => {
            localStorage.setItem('PSAuthKey', 'token');
            mayaClient.get.mockRejectedValue(new Error('API failed'));
            await expect(
                userModule.actions.authenticateWithMaya({ commit }),
            ).rejects.toThrow('API failed');
            expect(mayaClient.get).toHaveBeenCalledWith('/auth/authenticate');
        });

        it('authenticateWithMaya clears auth error on valid flow', async () => {
            localStorage.setItem('PSAuthKey', 'token');
            mayaClient.get.mockResolvedValue({
                UserType: UserType.Agent,
            });

            await userModule.actions.authenticateWithMaya({ commit });
            expect(commit).toHaveBeenCalledWith('set-auth-error', null);
        });

        it('getUserProfile resets auth error on success', async () => {
            localStorage.setItem('PSAuthKey', 'token');
            mayaClient.get.mockResolvedValue({
                FullName: 'Dev',
                Type: UserType.Agent,
            });

            await userModule.actions.getUserProfile({
                commit,
                dispatch,
                state: { user: { uid: 'agent_user' } },
            });

            expect(commit).toHaveBeenCalledWith('set-auth-error', null);
        });

        it('getUserProfile writes cache when Type exists', async () => {
            localStorage.setItem('PSAuthKey', 'token');
            const state = { user: { uid: 'agent_user' } };
            mayaClient.get.mockResolvedValue({
                FullName: 'Dev',
                Type: UserType.Agent,
            });

            await userModule.actions.getUserProfile({
                commit,
                dispatch,
                state,
            });

            const cache = localStorage.getItem('profile:agent_user');
            expect(cache).not.toBeNull();
            expect(JSON.parse(cache)).toHaveProperty('data');
        });

        it('getUserProfile removes corrupted cache', async () => {
            localStorage.setItem('PSAuthKey', 'token');
            const state = { user: { uid: 'agent_user' } };
            localStorage.setItem('profile:agent_user', 'invalid-json');
            mayaClient.get.mockResolvedValue({
                FullName: 'Dev',
                Type: UserType.Agent,
            });

            await userModule.actions.getUserProfile({
                commit,
                dispatch,
                state,
            });

            expect(localStorage.getItem('profile:agent_user')).not.toBe(
                'invalid-json',
            );
        });

        it('logOut clears profile cache from localStorage', async () => {
            const state = { user: { uid: 'agent_user' } };
            localStorage.setItem(
                'profile:agent_user',
                JSON.stringify({ test: true }),
            );

            await userModule.actions.logOut({
                commit,
                dispatch,
                state,
            });

            expect(localStorage.getItem('profile:agent_user')).toBeNull();
        });
    });
});
