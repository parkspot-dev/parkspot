import { mayaClient } from '@/services/api';

const state = {
    bookingDetails: Object,
    hasError: false,
    errorMessage: String,
    paymentDetails: null,
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
};

const actions = {
    async getBookingDetails({ commit }, bookingId) {
        const res = await mayaClient.get(
            '/booking/details?booking-id=' + bookingId,
        );
        if (res.Booking) {
            commit('update-booking', res);
        } else if (res.DisplayMsg) {
            commit('set-error', res.DisplayMsg + ' ( ' + res.ErrorMsg + ' )');
        }
    },
    async getPaymentLink({ commit }, reqBody) {
        const res = await mayaClient.post(
            '/payment/generate-payment-link',
            reqBody,
        );
        if (res) {
            console.log(res);

            commit('set-payment-details', res);
        } else if (res.DisplayMsg) {
            commit('set-error', res.DisplayMsg + ' ( ' + res.ErrorMsg + ' )');
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
