import { mayaClient } from '@/services/api';

const state = {
    spotRequests: [],
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
    'set-spot-requests'(state, spotRequests) {
        state.hasError = false;
        state.spotRequests = spotRequests;
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
    async fetchSpotRequests({ commit }) {
        commit('set-loading', true);
            const res = await mayaClient.get('/owner/spot-list');
            if(res.DisplayMsg){
                commit('set-error', res.DisplayMsg + ' ( ' + res.ErrorMsg + ' )');
            }else {
                commit('set-spot-requests', res);
            }
            commit('set-loading', false);
    },

    async updateStatus({}, spotData) {
          const FieldMask = ['Status']
          const spotRequest = {...spotData, FieldMask};
          const res = await mayaClient.patch('/owner/spot-request', spotRequest);
          console.log("This is res...", res);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
