import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import userModule from '@/store/user';
import { UserType } from "@/constant/enums";
import { mayaClient } from "@/services/api";

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
        commit = vi.fn();
        dispatch = vi.fn();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('authenticateWithMaya commits set-user-type when userType is Agent', async () => {
        mayaClient.get.mockResolvedValue({
            UserType: UserType.Agent,
        });

        await userModule.actions.authenticateWithMaya({ commit });

        expect(commit).toHaveBeenCalledWith(
            'set-user-type',
            UserType.Agent
        );
    });

    it('authenticateWithMaya does nothing if UserType is missing', async () => {
        mayaClient.get.mockResolvedValue({});

        await userModule.actions.authenticateWithMaya({ commit });

        expect(commit).not.toHaveBeenCalled();
    });

    it('getUserProfile sets user type when profile has Type', async () => {
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
        mayaClient.get.mockResolvedValue({
            FullName: 'User Without Type',
        });

        await userModule.actions.getUserProfile({ commit, dispatch });

        expect(dispatch).toHaveBeenCalledWith('authenticateWithMaya');
    });

    it('getUserProfile falls back to authenticateWithMaya when API fails', async () => {
        mayaClient.get.mockRejectedValue(new Error('API failed'));

        await userModule.actions.getUserProfile({ commit, dispatch });

        expect(dispatch).toHaveBeenCalledWith('authenticateWithMaya');
    });

    it('logOut resets user and userProfile', async () => {
        await userModule.actions.logOut({ commit, dispatch });

        expect(dispatch).toHaveBeenCalledWith('app/clearAgents', null, {
            root: true,
        });

        expect(commit).toHaveBeenCalledWith('update-user', null);
        expect(commit).toHaveBeenCalledWith('reset-user-profile');
    });
})
