import { mayaClient } from '@/services/api';

const state = {
    activeBookings: [],
    pastBookings: [],
    requestedBookings: [],
    payments: [],
    hasError: false,
    errorMessage: '',
    isLoading: false,
    searchDate: '',
    cachePayments: {}, 
};

const getters = {
    allUserRequests: (state) => ({
        active: state.activeBookings,
        past: state.pastBookings,
        requested: state.requestedBookings,
    }),
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
        state.searchDate = text;
    },
    'set-payments'(state, payments) {
        state.payments = payments;
    },
    'set-cache-payment'(state, { paymentID, payments }) {
        state.cachePayments[paymentID] = payments;
    }
};

const actions = {
    async fetchUsersRequests({ commit }) {
        if (state.isLoading) return;

        try {
            commit('set-loading', true);

            const response = await mayaClient.get(`/booking/history`);
            if (response.ErrorCode) {
                throw new Error(response.DisplayMsg);
            }

            const active = (response.ActiveBookings || []).filter(
                (b) => b.SiteDetails !== null
            );

            const past = (response.PastBookings || []).filter(
                (b) => b.SiteDetails !== null
            );

            const requested = (response.RequestedBookings || []).filter(
                (b) => b.SiteDetails !== null
            );
            commit('set-requests', {
                ActiveBookings: active,
                PastBookings: past,
                RequestedBookings: requested,
            });
        } catch (error) {
            commit('set-error', error.message);
        } finally {
            commit('set-loading', false);
        }
    },

    async fetchPayments({ commit }, paymentID) {
        if (state.cachePayments[paymentID]) {
            commit('set-payments', state.cachePayments[paymentID]);
            return; 
        }
        if (state.isLoading) return;
        try {
            commit('set-loading', true);
            const response = await mayaClient.get(
                `/booking/${paymentID}/payments`
            );
            if (response.ErrorCode) {
                throw new Error(response.DisplayMsg);
            }
            const payments = response.Payments;
            commit('set-payments', payments);
            commit('set-cache-payment', { paymentID, payments });
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
