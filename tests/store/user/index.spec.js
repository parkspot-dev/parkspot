import { describe, it, expect, vi, beforeEach } from 'vitest';
import userModule from '@/store/user';
import { UserType } from '@/constant/enums';
import { mayaClient } from '@/services/api';
import { signOut, signInWithPopup } from 'firebase/auth';

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
        signInWithPopup: vi.fn(),
        GoogleAuthProvider: vi.fn(),
    };
});

describe('User Store - Agent Auth Fix', () => {
    let commit;
    let dispatch;

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();

        mayaClient.get.mockReset().mockResolvedValue({});
        mayaClient.post.mockReset().mockResolvedValue({});
        mayaClient.patch.mockReset().mockResolvedValue({});

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

    describe('User Store - Mutations & Actions Coverage', () => {
        it('tests state function defaults', () => {
            const defaultState = userModule.state();
            expect(defaultState.user).toBeNull();
            expect(defaultState.userProfile.Type).toBe('VO');
            expect(defaultState.isAdmin).toBe(false);
            expect(defaultState.isAgent).toBe(false);
        });

        it('mutations update state as expected', () => {
            const stateObj = userModule.state();

            userModule.mutations['update-user'](stateObj, { uid: 'u1' });
            expect(stateObj.user).toEqual({ uid: 'u1' });

            userModule.mutations['update-user'](stateObj, null);
            expect(stateObj.user).toBeNull();
            expect(stateObj.isAdmin).toBe(false);
            expect(stateObj.isAgent).toBe(false);

            userModule.mutations['update-user-profile'](stateObj, {
                FullName: 'Test User',
            });
            expect(stateObj.userProfile.FullName).toBe('Test User');
            expect(stateObj.userProfile.UserName).toBe('');

            userModule.mutations['update-user-profile'](stateObj, {
                ErrorCode: 500,
                DisplayMsg: 'Error',
            });
            expect(stateObj.userProfile.ErrorCode).toBe(500);

            userModule.mutations['update-login-modal'](stateObj, true);
            expect(stateObj.loginModal).toBe(true);

            userModule.mutations['update-auth-ready'](stateObj, true);
            expect(stateObj.isAuthReady).toBe(true);

            userModule.mutations['update-contact'](stateObj, { cno: '123' });
            expect(stateObj.contactForm).toEqual({ cno: '123' });

            userModule.mutations['update-kyc'](stateObj, { owner: 'self' });
            expect(stateObj.kycForm).toEqual({ owner: 'self' });

            userModule.mutations['update-additional-info'](stateObj, {
                rent: '500',
            });
            expect(stateObj.additionalInfo).toEqual({ rent: '500' });

            userModule.mutations['update-login'](stateObj, { Username: 'u' });
            expect(stateObj.login).toEqual({ Username: 'u' });

            userModule.mutations['update-location-details'](stateObj, {
                loc: 'bglr',
            });
            expect(stateObj.locationDetails).toEqual({ loc: 'bglr' });

            userModule.mutations['update-preference'](stateObj, { pref: 'a' });
            expect(stateObj.preference).toEqual({ pref: 'a' });

            userModule.mutations['set-user-type'](stateObj, UserType.Admin);
            expect(stateObj.isAdmin).toBe(true);
            expect(stateObj.isAgent).toBe(true);

            userModule.mutations['set-user-type'](stateObj, UserType.Agent);
            expect(stateObj.isAdmin).toBe(false);
            expect(stateObj.isAgent).toBe(true);

            userModule.mutations['update-images'](stateObj, ['img1']);
            expect(stateObj.contactForm.images).toEqual(['img1']);

            userModule.mutations['reset-user-profile'](stateObj);
            expect(stateObj.userProfile).toEqual({
                FullName: '',
                EmailID: '',
                Mobile: '',
                Type: 'VO',
            });

            userModule.mutations['set-auth-error'](stateObj, 'err');
            expect(stateObj.authError).toBe('err');
        });

        it('loginWithGoogle handles successful Google login', async () => {
            const userMock = {
                getIdToken: vi.fn().mockResolvedValue('google_token_123'),
            };
            signInWithPopup.mockResolvedValue({ user: userMock });

            await userModule.actions.loginWithGoogle({ commit, dispatch });

            expect(localStorage.getItem('PSAuthKey')).toBe('google_token_123');
            expect(commit).toHaveBeenCalledWith('update-user', userMock);
            expect(commit).toHaveBeenCalledWith('update-login-modal', false);
            expect(dispatch).toHaveBeenCalledWith(
                'authenticateWithMaya',
                expect.anything(),
                expect.anything(),
            );
        });

        it('loginWithGoogle handles empty token from Google login', async () => {
            const userMock = {
                getIdToken: vi.fn().mockResolvedValue(''),
            };
            signInWithPopup.mockResolvedValue({ user: userMock });

            await userModule.actions.loginWithGoogle({ commit, dispatch });

            expect(commit).not.toHaveBeenCalledWith('update-user', userMock);
        });

        it('register posts auth register and updates login', async () => {
            const state = {
                contactForm: { fullname: 'John', email: 'john@ex.com' },
                locationDetails: { locDetails: { locName: 'City' } },
            };

            await userModule.actions.register({ commit, state });

            expect(commit).toHaveBeenCalledWith(
                'update-login',
                expect.objectContaining({ Password: 'dummy@123' }),
            );
            expect(mayaClient.post).toHaveBeenCalledWith(
                '/auth/register',
                expect.objectContaining({ FullName: 'John', City: 'City' }),
            );
        });

        it('login posts auth login', async () => {
            const state = { login: { Username: 'u', Password: 'p' } };
            await userModule.actions.login({ state });
            expect(mayaClient.post).toHaveBeenCalledWith(
                '/auth/login',
                state.login,
            );
        });

        it('kyc patches /kyc payload', async () => {
            const state = {
                contactForm: { cno: '9876543210' },
                login: { Username: 'user1' },
                kycForm: { owner: 'self', documentData: 'doc', imgData: 'img' },
            };

            await userModule.actions.kyc({ state });

            expect(mayaClient.patch).toHaveBeenCalledWith(
                '/kyc',
                expect.objectContaining({
                    ContactNo: '9876543210',
                    UserName: 'user1',
                    Owner: 'self',
                }),
            );
        });

        it('updateUserInfo calls post and handles errors', async () => {
            const state = { userProfile: { FullName: 'New Name' } };
            mayaClient.post.mockResolvedValue({});

            await userModule.actions.updateUserInfo({ commit, state });
            expect(mayaClient.post).toHaveBeenCalledWith(
                '/auth/update-fields',
                state.userProfile,
            );

            mayaClient.post.mockRejectedValue({
                response: { data: { DisplayMsg: 'Display Error' } },
            });
            await expect(
                userModule.actions.updateUserInfo({ commit, state }),
            ).rejects.toThrow('Display Error');
        });

        it('updateImages dispatches commit update-images', () => {
            userModule.actions.updateImages({ commit }, ['img1.jpg']);
            expect(commit).toHaveBeenCalledWith('update-images', ['img1.jpg']);
        });

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
    });

    describe('UTM parameters in API calls', () => {
        beforeEach(() => {
            window.history.replaceState(
                {},
                '',
                '/?utm_campaign=diwali_sale&utm_content=hero_banner&utm_source=google',
            );
        });

        it('registerSpot includes UTM in Remark field', async () => {
            const state = {
                contactForm: {
                    fullname: 'Test Owner',
                    cno: '9999999999',
                    remark: 'My spot remark',
                },
            };

            await userModule.actions.registerSpot({ state });

            expect(mayaClient.post).toHaveBeenCalledWith(
                '/owner/spot-request',
                expect.objectContaining({
                    FullName: 'Test Owner',
                    Comments:
                        'My spot remark\n[utm_campaign]: diwali_sale\n[utm_content]: hero_banner\n[utm_source]: google',
                    Remark: 'My spot remark\n[utm_campaign]: diwali_sale\n[utm_content]: hero_banner\n[utm_source]: google',
                }),
            );
        });

        it('requestSpot includes UTM in Comments and Remark fields', async () => {
            const state = {
                contactForm: {
                    fullname: 'Test Seeker',
                    cno: '8888888888',
                },
                preference: {
                    carModel: 'SUV',
                    minDur: '2 hours',
                },
            };

            await userModule.actions.requestSpot({ state });

            expect(mayaClient.post).toHaveBeenCalledWith(
                '/owner/parking-request',
                expect.objectContaining({
                    Name: 'Test Seeker',
                    Comments:
                        '[utm_campaign]: diwali_sale\n[utm_content]: hero_banner\n[utm_source]: google',
                    Remark: '[utm_campaign]: diwali_sale\n[utm_content]: hero_banner\n[utm_source]: google',
                }),
            );
        });

        it('contact includes UTM in Comments field', async () => {
            const state = {
                login: {},
                contactForm: { fullname: 'Contact User' },
                additionalInfo: {},
                locationDetails: {},
            };

            await userModule.actions.contact({ state });

            expect(mayaClient.post).toHaveBeenCalledWith(
                '/contact',
                expect.objectContaining({
                    Comments:
                        'Spot Registered\n[utm_campaign]: diwali_sale\n[utm_content]: hero_banner\n[utm_source]: google',
                }),
            );
        });

        it('onlyContact includes UTM in Comments field', async () => {
            const state = {
                contactForm: {
                    msg: 'Need help',
                    carModel: 'Sedan',
                },
            };

            await userModule.actions.onlyContact({ state });

            expect(mayaClient.post).toHaveBeenCalledWith(
                '/contact',
                expect.objectContaining({
                    Comments:
                        'From the Home Page ----->Need help Car Model: Sedan\n[utm_campaign]: diwali_sale\n[utm_content]: hero_banner\n[utm_source]: google',
                }),
            );
        });
    });
});
