import { mayaClient } from '@/services/api';

const state = {
    sites: [],
    hasError: false,
    errorMessage: '',
    isLoading: false,
};

const getters = {
    allSites: (state) => state.sites,
    isLoading: (state) => state.isLoading,
    hasError: (state) => state.hasError,
    errorMessage: (state) => state.errorMessage,
};

const mutations = {
    'set-sites'(state, sites) {
        state.hasError = false;
        state.sites = sites;
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
    async fetchSites({ commit, state }, { query, searchType }) {
        if (state.isLoading) return;

        try {
            commit('set-loading', true);
            commit('set-error', '');
            commit('set-sites', []);

            let sites = [];
            const trimmedQuery = query.trim();
            if (searchType === 'name') {
                const encodedName = encodeURIComponent(trimmedQuery);
                const res = await mayaClient.get(
                    `/sites-by-name?name=${encodedName}`,
                );
                if (res.ErrorCode) {
                    throw new Error(
                        res.DisplayMsg || 'Failed to fetch sites by name',
                    );
                }
                console.log('this is res', res);
                sites = res || [];
            } else if (searchType === 'mobile') {
                const encodedMobile = encodeURIComponent(
                    trimmedQuery.replace(/\s+/g, ''),
                );
                const res = await mayaClient.get(
                    `/sites-and-spot-requests?mobile=${encodedMobile}`,
                );
                if (res.ErrorCode) {
                    throw new Error(
                        res.DisplayMsg ||
                            'Failed to fetch sites by mobile number',
                    );
                }
                console.log('this is res (mobile)', res);
                sites = res.Sites || res.sites || [];
            }
            commit('set-sites', sites);
        } catch (error) {
            commit('set-error', error.message);
            throw error;
        } finally {
            commit('set-loading', false);
        }
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
