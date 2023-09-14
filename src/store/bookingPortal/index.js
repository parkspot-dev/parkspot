import { mayaClient } from '@/services/api';

const state = {
    bookingDetails: null,
    hasError: false,
    errorMessage: String,
    paymentDetails: null,
    isLoading: false,
};

const getters = {};

const mutations = {
    'update-booking'(state, bookingDetails) {
        state.hasError = false;
        state.bookingDetails = bookingDetails;
    },

    'set-error'(state, errorMessage) {
        state.hasError = true;
        state.errorMessage = errorMessage;
    },

    'set-payment-details'(state, paymentDetails) {
        state.paymentDetails = paymentDetails;
    },

    'set-loading'(state, isLoading) {
        state.isLoading = isLoading;
    },
};

const actions = {
    async getBookingDetails({ commit }, bookingId) {
        commit('set-loading', true);
        const res = await mayaClient.get(
            '/booking/details?booking-id=' + bookingId,
        );
        if (res.Booking) {
            commit('update-booking', res);
        } else if (res.DisplayMsg) {
            commit('set-error', res.DisplayMsg + ' ( ' + res.ErrorMsg + ' )');
        }
        commit('set-loading', false);
    },

    async getPaymentLink({ dispatch, commit }, reqBody) {
        commit('set-loading', true);
        const res = await mayaClient.post(
            '/payment/generate-payment-link',
            reqBody,
        );
        if (res.DisplayMsg) {
            commit('set-error', res.DisplayMsg + ' ( ' + res.ErrorMsg + ' )');
        } else if (res) {
            commit('set-payment-details', res);
            dispatch('getBookingDetails', reqBody.BookingID);
        }
        commit('set-loading', false);
    },

    async updateBookingDetails({ commit, dispatch }, reqBody) {
        commit('set-loading', true);
        const res = await mayaClient.post('/booking/update', reqBody);
        if (res.Success) {
            dispatch('getBookingDetails', reqBody.ID);
        } else if (res.DisplayMsg) {
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
