import { mayaClient } from '@/services/api';

const state = {
    users: [],
    hasError: false,
    errorMessage: '',
    isLoading: false,
    searchMobile: '',
};

const getters = {
    users: (state) => state.users,
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
    async fetchKycPendingUsers({ commit, state }) {
        commit('set-loading', true);
        const url = state.searchMobile
            ? `/internal/users/kyc?Mobile=${state.searchMobile.replace(/\s+/g, '')}`
            : '/internal/users/kyc';
        const res = await mayaClient.get(url);
        if (res && res.DisplayMsg) {
            commit('set-error', res.DisplayMsg + ' ( ' + (res.ErrorMsg || '') + ' )');
        } else {
            commit('set-users', Array.isArray(res) ? res : (res ? [res] : []));
        }
        commit('set-loading', false);
    },

    async updateStatus({ commit }, { userData }) {
        commit('set-loading', true);
        const usernameOrMobile = userData?.User?.UserName || userData?.User?.Mobile || userData?.UserName || userData?.Mobile;
        const statusValue = userData?.User?.KYCStatus ?? userData?.KYCStatus;
        const res = await mayaClient.patch(`auth/user/${usernameOrMobile}/kycStatus`, {
            KYCStatus: statusValue,
        });
        if (res && res.DisplayMsg) {
            commit('set-error', res.DisplayMsg + ' ( ' + (res.ErrorMsg || '') + ' )');
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
