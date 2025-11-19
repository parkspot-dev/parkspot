import { mayaClient } from '@/services/api';

const CACHE_TIME = 10 * 60 * 1000;

const state = {
    activeBookings: [],
    pastBookings: [],
    requestedBookings: [],
    payments: [], 
    hasError: false,
    errorMessage: '',
    isLoading: false,
    searchDate: '',
    paymentsCachedAt: 0, 
    cachedPaymentID: null, 
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
        state.pastBookings = result.PastBookings;
        state.requestedBookings = result.RequestedBookings;
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
    'set-payments'(state, { paymentID, payments }) {
        state.payments = payments;
        state.cachedPaymentID = paymentID; 
        state.paymentsCachedAt = Date.now();  
    }
};

const actions = {
    async fetchUsersRequests({ commit }) {
        try {
            commit('set-loading', true);
            const response = await mayaClient.get(`/booking/history`);
            if (response.ErrorCode) throw new Error(response.DisplayMsg);
            commit('set-requests', response);
        } catch (error) {
            commit('set-error', error.message);
        } finally {
            commit('set-loading', false);
        }
    },

    async fetchPayments({ commit, state }, paymentID) {
        const now = Date.now();

        if (
            state.cachedPaymentID === paymentID &&
            (now - state.paymentsCachedAt < CACHE_TIME)
        ) {
            return;
        }

        try {
            commit('set-loading', true);
            const response = await mayaClient.get(`/booking/${paymentID}/payments`);
            if (response.ErrorCode) throw new Error(response.DisplayMsg);

            commit('set-payments', { paymentID, payments: response.Payments });
        } catch (error) {
            commit('set-error', error.message);
        } finally {
            commit('set-loading', false);
        }
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
