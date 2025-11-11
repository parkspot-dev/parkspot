import { mayaClient } from '@/services/api';

const state = {
    activeBookings: [],
    pastBookings: [],
    requestedBookings: [],
    hasError: false,
    errorMessage: '',
    isLoading: false,
    searchDate: '',
};

const getters = {
    allUserRequests: (state) => state.requests,
    isLoading: (state) => state.isLoading,
    hasError: (state) => state.hasError,
    errorMessage: (state) => state.errorMessage,
};

const mutations = {
    'set-requests'(state, result) {
        state.hasError = false;
        state.activeBookings = result.ActiveBookings;
        state.pastBookings = result.PastBookings,
        state.requestedBookings = result.RequestedBookings
    },
    'set-error'(state, errorMessage) {
        state.hasError = true;
        state.errorMessage = errorMessage;
    },
    'set-loading'(state, isLoading) {
        state.isLoading = isLoading;
    },
    'set-search-date'(state, text) {
        state.searchMobile = text;
    },
};

const actions = {
    // Fetches Pending KYC Users
    async fetchUsersRequests({ commit }) {
        console.log("inside store fetch requests")
        if (state.isLoading) return;
        try {
            commit('set-loading', true);
            const response = await mayaClient.get(`/booking/history`);
            console.log("this is response", response)
            if (response.ErrorCode) {
                throw new Error(response.DisplayMsg);
            }
            commit('set-requests', response);
        } catch (error) {
            commit('set-error', error.message);
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
