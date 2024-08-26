import { mayaClient } from '@/services/api';

const state = {
    bookingDetails: null,
    hasError: false,
    errorMessage: String,
    paymentDetails: null,
    isLoading: false,
    /*   [{
        "ID": 809,
        "CreatedAt": "2022-02-24T15:59:15.6168782Z",
        "UpdatedAt": "2023-11-26T10:31:41.4142083Z",
        "DeletedAt": null,
        "UserName": "HAZyqmXVwZXmIo6cjMq2DFKUGTY2",
        "Name": "Jayaram",
        "Mobile": "7975011411",
        "EmailID": "",
        "VehicleNumber": "",
        "SiteID": "BLR#Sai#Avenue",
        "Site": null,
        "SlotID": "",
        "StartTime": "2022-01-25T00:00:00+05:30",
        "EndTime": "2023-01-24T23:59:00+05:30",
        "Status": 1,
        "Rent": 1900,
        "BaseAmount": 1400,
        "ConvenienceFee": 0,
        "RentCycle": 25,
        "PaymentPeriod": 2,
        "SecurityDeposit": 0,
        "Remark": "Booking remark"
      }] */
    activeBookings: [],
    agents: {},
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

    'set-active-bookings'(state, activeBookings) {
        state.activeBookings = activeBookings;
    },

    'set-agent-list'(state, agents) {
        state.agents = agents.filter((agent) => {
            const fullName = agent.FullName.toLowerCase();
            return !(fullName.startsWith('[') && fullName.endsWith(']'));
        });
    },
};

const actions = {
    async getAgents({ commit }) {
        commit('set-agent-list', await mayaClient.get('/auth/user/agents'));
    },

    async getBookingDetails({ commit }, bookingId) {
        console.log('getBookingDetails is called');
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

    async refreshPaymentStatus({ dispatch, commit, state }, paymentId) {
        if (paymentId == 0) {
            return;
        }
        commit('set-loading', true);
        const res = await mayaClient.get(
            '/payment/status?order_id=' + paymentId,
        );
        commit('set-loading', false);
        if (res.DisplayMsg) {
            commit('set-error', res.DisplayMsg + ' ( ' + res.ErrorMsg + ' )');
        } else if (res) {
            dispatch('getBookingDetails', state.bookingDetails.Booking.ID);
        }
    },

    async updateBookingDetails({ commit, dispatch }, reqBody) {
        debugger;
        commit('set-loading', true);
        const res = await mayaClient.post('/booking/update', reqBody);
        if (res.Success) {
            dispatch('getBookingDetails', reqBody.ID);
        } else if (res.DisplayMsg) {
            commit('set-error', res.DisplayMsg + ' ( ' + res.ErrorMsg + ' )');
        }
        commit('set-loading', false);
    },

    async getActiveBooking({ commit }) {
        commit('set-loading', true);
        const res = await mayaClient.get('/internal/active-bookings');
        if (res.DisplayMsg) {
            commit('set-error', res.DisplayMsg + ' ( ' + res.ErrorMsg + ' )');
        } else {
            commit('set-active-bookings', res);
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
