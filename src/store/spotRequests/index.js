import { mayaClient } from '@/services/api';
import { reportError } from '@/telemetry';

const apiFailure = new Error('Spot requests API returned an error');
const fetchFailure = new Error('Failed to fetch spot requests');

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
        try {
            const res = await mayaClient.get('/owner/spot-list');
            if (res?.DisplayMsg) {
                reportError(apiFailure, {
                    source: 'spot_requests',
                    failure: 'api_response',
                });
                commit('set-error', `${res.DisplayMsg} ( ${res.ErrorMsg} )`);
            } else {
                commit('set-spot-requests', Array.isArray(res) ? res : []);
            }
        } catch (error) {
            reportError(error || fetchFailure, {
                source: 'spot_requests',
                failure: 'fetch',
            });
            commit(
                'set-error',
                error?.message || 'Failed to fetch spot requests',
            );
        } finally {
            commit('set-loading', false);
        }
    },

    async updateStatus(_, spotData) {
        const FieldMask = ['Status'];
        const spotRequest = { ...spotData, FieldMask };
        return await mayaClient.patch('/owner/spot-request', spotRequest);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
