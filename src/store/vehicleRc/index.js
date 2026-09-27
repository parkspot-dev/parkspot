import { mayaClient } from '@/services/api';

const extractErrorMessage = (data, fallback) =>
    data?.DisplayMsg ||
    data?.message ||
    data?.Message ||
    data?.error ||
    data?.Error ||
    (typeof data === 'string' ? data : '') ||
    fallback;

const state = () => ({
    errorMessage: null,
});

const mutations = {
    'set-rc-error'(state, errorMessage) {
        state.errorMessage = errorMessage;
    },
};

const actions = {
    // Unlike identityKyc, this is a single synchronous call — no
    // redirect/polling. The response carries the resulting KYCStatus
    // directly, which we fold into the shared user profile so every
    // consumer of `userProfile.KYCStatus` (this card included) sees it.
    async verifyRc({ commit, rootState }, { vehicleNumber } = {}) {
        commit('set-rc-error', null);

        const res = await mayaClient.post('/kyc/vehicle-rc/verify', {
            VehicleNumber: vehicleNumber,
            OwnerName: rootState.user.userProfile?.FullName,
        });

        if (res?.KYCStatus === undefined || res?.KYCStatus === null) {
            const message = extractErrorMessage(
                res,
                'Could not verify vehicle RC. Please try again.',
            );
            commit('set-rc-error', message);
            throw new Error(message);
        }

        commit(
            'user/update-user-profile',
            { ...rootState.user.userProfile, KYCStatus: res.KYCStatus },
            { root: true },
        );

        return res.KYCStatus;
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
