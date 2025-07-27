import { mayaClient } from '@/services/api';

const state = {
    users: [],
    hasError: false,
    errorMessage: '',
    isLoading: false,
    searchMobile: '',
};

const getters = {
    allSpotRequests: (state) => state.spotRequests,
    isLoading: (state) => state.isLoading,
    hasError: (state) => state.hasError,
    errorMessage: (state) => state.errorMessage,
};

const mutations = {
    'set-users'(state, users) {
        state.hasError = false;
        state.users = users;
    },
    'set-error'(state, errorMessage) {
        state.hasError = true;
        state.errorMessage = errorMessage;
    },
    'set-loading'(state, isLoading) {
        state.isLoading = isLoading;
    },
    'set-search-mobile'(state, text) {
        state.searchMobile = text;
    },
};

const actions = {
    // Fetches Pending KYC Users
    async fetchKycPendingUsers({ commit }) {
        if (state.isLoading) return;
        try {
            commit('set-loading', true);
            const BASE_KYC_PENDING_USERS_URL = '/internal/users/kyc-status';
            const kycPendingStatusURL = state.searchMobile
                ? `${BASE_KYC_PENDING_USERS_URL}?mobile=${state.searchMobile.replace(
                      /\s+/g,
                      '',
                  )}`
                : BASE_KYC_PENDING_USERS_URL;
            const response = await mayaClient.get(kycPendingStatusURL);
            if (response.ErrorCode) {
                throw new Error(response.DisplayMsg);
            }
            commit('set-users', response);
        } catch (error) {
            commit('set-error', error.message);
        } finally {
            commit('set-loading', false);
        }
    },

    async updateStatus({ commit }, { userData }) {
        commit('set-loading', true);
        const res = await mayaClient.patch(
            `auth/user/${userData.UserName}/kycStatus`,
            {
                KYCStatus: userData.KYCStatus,
            },
        );
        if (res.DisplayMsg) {
            commit('set-error', res.DisplayMsg + ' ( ' + res.ErrorMsg + ' )');
        }
        commit('set-loading', false);
    },

    updateMobileInput({ commit }, mobileInput) {
        commit('set-search-mobile', mobileInput);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
