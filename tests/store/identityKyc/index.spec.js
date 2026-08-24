import { describe, it, expect, vi, beforeEach } from 'vitest';
import identityKyc from '@/store/identityKyc/index';
import { mayaClient } from '@/services/api';
import { IdentityKycStatus, IDENTITY_KYC_AADHAAR_ID_TYPE } from '@/constant/enums';

vi.mock('@/services/api', () => ({
    mayaClient: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

describe('Vuex Module: identityKyc', () => {
    let state;

    beforeEach(() => {
        state = identityKyc.state();
        vi.clearAllMocks();
    });

    it('has correct initial state', () => {
        expect(state.verificationId).toBe(null);
        expect(state.status).toBe(IdentityKycStatus.NotVerified);
        expect(state.errorMessage).toBe(null);
    });

    describe('mutations', () => {
        it('set-kyc-status updates status', () => {
            identityKyc.mutations['set-kyc-status'](state, IdentityKycStatus.Pending);
            expect(state.status).toBe(IdentityKycStatus.Pending);
        });

        it('set-verification-id updates verificationId', () => {
            identityKyc.mutations['set-verification-id'](state, 'V123');
            expect(state.verificationId).toBe('V123');
        });

        it('set-kyc-error updates errorMessage', () => {
            identityKyc.mutations['set-kyc-error'](state, 'Something failed');
            expect(state.errorMessage).toBe('Something failed');
        });
    });

    describe('actions.initiateKyc', () => {
        it('posts the Aadhaar payload and commits verificationId + Pending status on success', async () => {
            const commit = vi.fn();
            mayaClient.post.mockResolvedValue({
                VerificationID: 'V123',
                RedirectURL: 'https://cashfree.example/redirect',
                Status: 'Initiated',
            });

            const redirectUrl = await identityKyc.actions.initiateKyc(
                { commit },
                { idNumber: '123456789012' },
            );

            expect(mayaClient.post).toHaveBeenCalledWith('/kyc/initiate', {
                IdNumber: '123456789012',
                IdType: IDENTITY_KYC_AADHAAR_ID_TYPE,
            });
            expect(commit).toHaveBeenCalledWith('set-kyc-error', null);
            expect(commit).toHaveBeenCalledWith('set-verification-id', 'V123');
            expect(commit).toHaveBeenCalledWith('set-kyc-status', IdentityKycStatus.Pending);
            expect(redirectUrl).toBe('https://cashfree.example/redirect');
        });

        it('commits Failed status and throws when VerificationID is missing', async () => {
            const commit = vi.fn();
            mayaClient.post.mockResolvedValue({ DisplayMsg: 'Invalid Aadhaar' });

            await expect(
                identityKyc.actions.initiateKyc({ commit }, { idNumber: '123456789012' }),
            ).rejects.toThrow('Invalid Aadhaar');

            expect(commit).toHaveBeenCalledWith('set-kyc-status', IdentityKycStatus.Failed);
            expect(commit).toHaveBeenCalledWith('set-kyc-error', 'Invalid Aadhaar');
        });

        it('commits Failed status and throws when RedirectURL is missing', async () => {
            const commit = vi.fn();
            mayaClient.post.mockResolvedValue({ VerificationID: 'V123' });

            await expect(
                identityKyc.actions.initiateKyc({ commit }, { idNumber: '123456789012' }),
            ).rejects.toThrow();

            expect(commit).toHaveBeenCalledWith('set-kyc-status', IdentityKycStatus.Failed);
        });

        it('falls back to a default error message when the API gives none', async () => {
            const commit = vi.fn();
            mayaClient.post.mockResolvedValue({});

            await expect(
                identityKyc.actions.initiateKyc({ commit }, { idNumber: '123456789012' }),
            ).rejects.toThrow('Could not start verification. Please try again.');
        });
    });

    describe('actions.checkKycStatus', () => {
        it('queries by verificationId and commits Verified on VERIFIED', async () => {
            state.verificationId = 'V123';
            const commit = vi.fn();
            mayaClient.get.mockResolvedValue({ Status: 'VERIFIED' });

            const result = await identityKyc.actions.checkKycStatus({ commit, state });

            expect(mayaClient.get).toHaveBeenCalledWith('/kyc/status?VerificationID=V123');
            expect(commit).toHaveBeenCalledWith('set-kyc-status', IdentityKycStatus.Verified);
            expect(commit).not.toHaveBeenCalledWith('set-kyc-error', expect.anything());
            expect(result).toBe(IdentityKycStatus.Verified);
        });

        it('commits Failed and an error message on FAILED', async () => {
            state.verificationId = 'V123';
            const commit = vi.fn();
            mayaClient.get.mockResolvedValue({ Status: 'FAILED', DisplayMsg: 'Rejected' });

            const result = await identityKyc.actions.checkKycStatus({ commit, state });

            expect(commit).toHaveBeenCalledWith('set-kyc-status', IdentityKycStatus.Failed);
            expect(commit).toHaveBeenCalledWith('set-kyc-error', 'Rejected');
            expect(result).toBe(IdentityKycStatus.Failed);
        });

        it('maps an unrecognized status string to Pending', async () => {
            state.verificationId = 'V123';
            const commit = vi.fn();
            mayaClient.get.mockResolvedValue({ Status: 'Initiated' });

            const result = await identityKyc.actions.checkKycStatus({ commit, state });

            expect(commit).toHaveBeenCalledWith('set-kyc-status', IdentityKycStatus.Pending);
            expect(result).toBe(IdentityKycStatus.Pending);
        });

        it('leaves the current status untouched when the API returns no Status', async () => {
            state.verificationId = 'V123';
            state.status = IdentityKycStatus.Pending;
            const commit = vi.fn();
            mayaClient.get.mockResolvedValue({});

            const result = await identityKyc.actions.checkKycStatus({ commit, state });

            expect(commit).not.toHaveBeenCalled();
            expect(result).toBe(IdentityKycStatus.Pending);
        });
    });
});
