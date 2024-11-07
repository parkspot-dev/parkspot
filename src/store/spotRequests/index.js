import { mayaClient } from '@/services/api';
import { SPOT_REQUESTS } from '../../constant/constant';
const state = {
    spotRequests: SPOT_REQUESTS,  
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
    async fetchSpotRequests({ commit }) {
        commit('set-loading', true);
        try {
            const res = await mayaClient.get('maya.parkspot.in/owner/spot-request');
            console.log("spot request response", res);
            // TODO: commit the result of Spot Request to set-spot-requests
        } catch (error) {
            commit('set-error', 'Error fetching spot requests');
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
