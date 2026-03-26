import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import userModule from '@/store/user';
import { UserType } from '@/constant/enums';
import { mayaClient } from '@/services/api';

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
        localStorage.clear();
        commit = vi.fn();
        dispatch = vi.fn();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('authenticateWithMaya commits set-user-type when userType is Agent', async () => {
        localStorage.setItem('PSAuthKey', 'token');
        mayaClient.get.mockResolvedValue({
            UserType: UserType.Agent,
        });

        await userModule.actions.authenticateWithMaya({ commit });

        expect(commit).toHaveBeenCalledWith('set-user-type', UserType.Agent);
    });

    it('authenticateWithMaya does nothing if UserType is missing', async () => {
        localStorage.setItem('PSAuthKey', 'token');
        mayaClient.get.mockResolvedValue({});

        await userModule.actions.authenticateWithMaya({ commit });

        expect(commit).not.toHaveBeenCalled();
    });

    it('authenticateWithMaya does not call API when PsAuthKey is undefined', async () => {
        localStorage.setItem('PSAuthKey', 'undefined');

        await userModule.actions.authenticateWithMaya({ commit });

        expect(mayaClient.get).not.toHaveBeenCalled();
        expect(commit).not.toHaveBeenCalled();
    });

    it('getUserProfile sets user type when profile has Type', async () => {
        localStorage.setItem('PSAuthKey', 'token');
        mayaClient.get.mockResolvedValue({
            FullName: 'Agent User',
            Type: UserType.Agent,
        });

        await userModule.actions.getUserProfile({ commit, dispatch });

        expect(commit).toHaveBeenCalledWith(
            'update-user-profile',
            expect.objectContaining({
                Type: UserType.Agent,
            }),
        );

        expect(commit).toHaveBeenCalledWith('set-user-type', UserType.Agent);

        expect(dispatch).not.toHaveBeenCalled();
    });

    it('getUserProfile falls back to authenticateWithMaya when Type is missing', async () => {
        localStorage.setItem('PSAuthKey', 'token');
        mayaClient.get.mockResolvedValue({
            FullName: 'User Without Type',
        });

        await userModule.actions.getUserProfile({ commit, dispatch });

        expect(dispatch).toHaveBeenCalledWith('authenticateWithMaya');
    });

    it('getUserProfile falls back to authenticateWithMaya when API fails', async () => {
        localStorage.setItem('PSAuthKey', 'token');
        mayaClient.get.mockRejectedValue(new Error('API failed'));

        await userModule.actions.getUserProfile({ commit, dispatch });

        expect(dispatch).toHaveBeenCalledWith('authenticateWithMaya');
    });

    it('getUserProfile does not call user/authenticate APIs when PsAuthKey is undefined', async () => {
        localStorage.setItem('PSAuthKey', 'undefined');

        await userModule.actions.getUserProfile({ commit, dispatch });

        expect(mayaClient.get).not.toHaveBeenCalled();
        expect(dispatch).not.toHaveBeenCalled();
        expect(commit).not.toHaveBeenCalled();
    });

    it('getUserProfile uses cache when valid', async () => {
        localStorage.setItem('PSAuthKey', 'token');

        const cached = {
            FullName: 'Cached User',
            Type: UserType.Agent,
        };

        localStorage.setItem('UserProfileCache', JSON.stringify(cached));
        localStorage.setItem('UserProfileCacheTime', Date.now().toString());

        await userModule.actions.getUserProfile({ commit, dispatch });

        expect(mayaClient.get).not.toHaveBeenCalled();

        expect(commit).toHaveBeenCalledWith(
            'update-user-profile',
            expect.objectContaining({
                FullName: 'Cached User',
            }),
        );

        expect(commit).toHaveBeenCalledWith('set-user-type', UserType.Agent);
    });

    it('getUserProfile calls API when cache expired', async () => {
        localStorage.setItem('PSAuthKey', 'token');

        const oldTime = Date.now() - 25 * 60 * 60 * 1000;

        localStorage.setItem(
            'UserProfileCache',
            JSON.stringify({ FullName: 'Old User' }),
        );
        localStorage.setItem('UserProfileCacheTime', oldTime.toString());

        mayaClient.get.mockResolvedValue({
            FullName: 'Fresh User',
            Type: UserType.Agent,
        });

        await userModule.actions.getUserProfile({ commit, dispatch });

        expect(mayaClient.get).toHaveBeenCalled();
    });

    it('logOut resets user and userProfile', async () => {
        await userModule.actions.logOut({ commit, dispatch });

        expect(dispatch).toHaveBeenCalledWith('app/clearAgents', null, {
            root: true,
        });

        expect(commit).toHaveBeenCalledWith('update-user', null);
        expect(commit).toHaveBeenCalledWith('reset-user-profile');
    });
});
