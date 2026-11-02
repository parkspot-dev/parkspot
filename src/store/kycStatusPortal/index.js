import { mayaClient } from '@/services/api';

const state = {
    users: [],
    hasError: false,
    errorMessage: '',
    isLoading: false,
    searchMobile: '',
    searchUsername: '',
    searchType: 'mobile',
};

const getters = {
    users: (state) => state.users,
    isLoading: (state) => state.isLoading,
    hasError: (state) => state.hasError,
    errorMessage: (state) => state.errorMessage,
    searchMobile: (state) => state.searchMobile,
    searchUsername: (state) => state.searchUsername,
    searchType: (state) => state.searchType,
};

const mutations = {
    'set-users'(state, users) {
        state.hasError = false;
        state.errorMessage = '';
        state.users = users;
    },
    'set-error'(state, errorMessage) {
        state.hasError = true;
        state.errorMessage = errorMessage;
    },
    'clear-error'(state) {
        state.hasError = false;
        state.errorMessage = '';
    },
    'set-loading'(state, isLoading) {
        state.isLoading = isLoading;
    },
    'set-search-mobile'(state, text) {
        state.searchMobile = text;
    },
    'set-search-username'(state, text) {
        state.searchUsername = text;
    },
    'set-search-type'(state, type) {
        state.searchType = type;
    },
};

const actions = {
    async fetchKycPendingUsers({ commit, state }) {
        if (state.isLoading) return;
        commit('clear-error');
        commit('set-loading', true);
        try {
            let url = '/internal/users/kyc';
            if (state.searchType === 'username') {
                if (state.searchUsername && state.searchUsername.trim()) {
                    url = `/internal/users/kyc?user_name=${encodeURIComponent(state.searchUsername.trim())}`;
                }
            } else if (state.searchType === 'mobile') {
                if (state.searchMobile && state.searchMobile.trim()) {
                    url = `/internal/users/kyc?mobile=${state.searchMobile.replace(/\s+/g, '')}`;
                }
            } else if (state.searchMobile && state.searchMobile.trim()) {
                url = `/internal/users/kyc?mobile=${state.searchMobile.replace(/\s+/g, '')}`;
            }

            const res = await mayaClient.get(url);
            if (res && (res.DisplayMsg || res.ErrorMsg)) {
                const message = res.DisplayMsg
                    ? res.DisplayMsg + (res.ErrorMsg ? ' ( ' + res.ErrorMsg + ' )' : '')
                    : res.ErrorMsg;
                throw new Error(message);
            }
            commit('set-users', Array.isArray(res) ? res : res ? [res] : []);
        } catch (error) {
            commit('set-users', []);
            commit('set-error', error.message);
        } finally {
            commit('set-loading', false);
        }
    },

    async updateStatus({ commit }, { userData }) {
        commit('clear-error');
        commit('set-loading', true);
        try {
            const usernameOrMobile =
                userData?.User?.UserName || userData?.User?.Mobile;
            const statusValue = userData?.User?.KYCStatus;
            const res = await mayaClient.patch(
                `auth/user/${usernameOrMobile}/kycStatus`,
                {
                    KYCStatus: statusValue,
                },
            );
            if (res && (res.DisplayMsg || res.ErrorMsg)) {
                const message = res.DisplayMsg
                    ? res.DisplayMsg + (res.ErrorMsg ? ' ( ' + res.ErrorMsg + ' )' : '')
                    : res.ErrorMsg;
                throw new Error(message);
            }
        } catch (error) {
            commit('set-error', error.message);
        } finally {
            commit('set-loading', false);
        }
    },

    updateMobileInput({ commit }, mobileInput) {
        commit('set-search-mobile', mobileInput);
    },

    updateUsernameInput({ commit }, usernameInput) {
        commit('set-search-username', usernameInput);
    },

    updateSearchType({ commit }, searchType) {
        commit('set-search-type', searchType);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
