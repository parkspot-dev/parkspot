import { mayaClient } from '@/services/api';

const state = {
    users: [],
    hasError: false,
    errorMessage: '',
    isLoading: false,
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
};

const actions = {
    // Fetches spot requests
    async fetchUsers({ commit }) {
        commit('set-loading', true);
        const res = await mayaClient.get('/internal/users/kyc-status');
        if (res.DisplayMsg) {
            commit('set-error', res.DisplayMsg + ' ( ' + res.ErrorMsg + ' )');
        } else {
            commit('set-users', res);
        }
        commit('set-loading', false);
    },

    async updateStatus({ commit }, userData) {
        commit('set-loading', true);
        const res = await mayaClient.post(
            `/user/${userData.UserName}/kycStatus`,
            {
                KYCStatus: userData.KYCStatus,
            },
        );
        if (res.DisplayMsg) {
            commit('set-error', res.DisplayMsg + ' ( ' + res.ErrorMsg + ' )');
        }
        commit('set-loading', false);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
