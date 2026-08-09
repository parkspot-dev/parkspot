import { mayaClient } from '@/services/api';
import { IdentityKycStatus, IDENTITY_KYC_AADHAAR_ID_TYPE } from '@/constant/enums';

const extractErrorMessage = (data, fallback) =>
    data?.DisplayMsg ||
    data?.message ||
    data?.Message ||
    data?.error ||
    data?.Error ||
    (typeof data === 'string' ? data : '') ||
    fallback;

// mayaClient.post() never throws on an HTTP error response (see
// services/api.js) — it resolves with `err.response.data`. So "did this
// succeed" has to be judged from the payload shape, not from a catch block.
//
// Cashfree's exact status vocabulary for the hosted redirect flow isn't
// pinned down yet beyond "Initiated" (seen on /kyc/initiate). Anything
// unrecognized (including "Initiated" itself) falls through to Pending, so
// this only needs to name the two terminal states we're sure of.
// ponytail: not matching invented synonyms (SUCCESS/COMPLETED/REJECTED) —
// unconfirmed by the real API. If Cashfree turns out to use one of those
// instead of VERIFIED/FAILED, add it here once observed.
const mapCashfreeStatus = (status) => {
    switch (String(status || '').toUpperCase()) {
        case 'VERIFIED':
            return IdentityKycStatus.Verified;
        case 'FAILED':
            return IdentityKycStatus.Failed;
        default:
            return IdentityKycStatus.Pending;
    }
};

const state = () => ({
    verificationId: null,
    status: IdentityKycStatus.NotVerified,
    errorMessage: null,
});

const mutations = {
    'set-kyc-status'(state, status) {
        state.status = status;
    },
    'set-verification-id'(state, verificationId) {
        state.verificationId = verificationId;
    },
    'set-kyc-error'(state, errorMessage) {
        state.errorMessage = errorMessage;
    },
};

const actions = {
    async initiateKyc({ commit }, { idNumber } = {}) {
        commit('set-kyc-error', null);

        const res = await mayaClient.post('/kyc/initiate', {
            IdNumber: idNumber,
            IdType: IDENTITY_KYC_AADHAAR_ID_TYPE,
        });

        if (!res?.VerificationID || !res?.RedirectURL) {
            commit('set-kyc-status', IdentityKycStatus.Failed);
            const message = extractErrorMessage(
                res,
                'Could not start verification. Please try again.',
            );
            commit('set-kyc-error', message);
            throw new Error(message);
        }

        commit('set-verification-id', res.VerificationID);
        // Once the redirect tab is opened the user is "in progress",
        // regardless of what Status string the initiate response echoes.
        commit('set-kyc-status', IdentityKycStatus.Pending);
        return res.RedirectURL;
    },

    async checkKycStatus({ commit, state }) {
        const res = await mayaClient.post('/kyc/status', {
            VerificationID: state.verificationId,
        });

        if (!res?.Status) {
            // A single transient failure/hiccup shouldn't wipe the current
            // status — the caller decides whether/when to check again.
            return state.status;
        }

        const status = mapCashfreeStatus(res.Status);
        commit('set-kyc-status', status);
        if (status === IdentityKycStatus.Failed) {
            commit(
                'set-kyc-error',
                extractErrorMessage(res, 'Verification failed.'),
            );
        }
        return status;
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
