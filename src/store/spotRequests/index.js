// Import dependencies and constants
import { mayaClient } from '@/services/api';
import { SPOT_REQUESTS } from '../../constant/constant';

// Define initial state
const state = {
    spotRequests: SPOT_REQUESTS,
    hasError: false,
    errorMessage: '',
    isLoading: false,
};

// Define getters to access state properties
const getters = {
    allSpotRequests: (state) => state.spotRequests,
    isLoading: (state) => state.isLoading,
    hasError: (state) => state.hasError,
    errorMessage: (state) => state.errorMessage,
};

// Define mutations to update state
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

// Define actions for asynchronous operations
const actions = {
    async fetchSpotRequests({ commit }) {
        commit('set-loading', true); // Set loading state
        try {
            const res = await mayaClient.get('maya.parkspot.in/owner/spot-request');
            console.log("spot request response", res);
            // TODO: commit the result of Spot Request to set-spot-requests
        } catch (error) {
            commit('set-error', 'Error fetching spot requests');
        } finally {
            commit('set-loading', false); // Reset loading state
        }
    },
};

// Export the Vuex module with namespacing
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
