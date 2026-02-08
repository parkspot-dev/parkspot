import { mayaClient } from '@/services/api';

const state = {
    /* Example of a booking object structure:
    [{
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
    agents: [],
    bookingDetails: null,
    errorMessage: String,
    hasError: false,
    // State to preserve the original data before any updates or changes.
    initialActiveBookingDetails: null,
    isFieldUpdated: false,
    isLoading: false,
    paymentDetails: null,
    searchText: '',
    status: 'none', // none, error, success
    statusMessage: '',
    successMessage: '',
    // State to preserve updated fields
    updatedFields: [],
};

const getters = {};

const mutations = {
    'update-booking'(state, bookingDetails) {
        state.hasError = false;
        state.bookingDetails = bookingDetails;
    },

    'set-error'(state, errorMessage) {
        state.status = 'error';
        state.statusMessage = errorMessage;
    },

    'set-success'(state, successMessage) {
        state.status = 'success';
        state.statusMessage = successMessage;
    },

    'reset-global-status'(state) {
        state.status = 'none';
        state.statusMessage = '';
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
        // filtering agent list to filter out the one which has fullname enclosed within []
        state.agents = agents.filter((agent) => {
            const fullName = agent.FullName.toLowerCase();
            return !(fullName.startsWith('[') && fullName.endsWith(']'));
        });
    },

    'set-search-text'(state, text) {
        state.searchText = text;
    },
    // Stores the initial state of active booking details
    'set-initial-active-booking-details'(state, bookingDetails) {
        state.initialActiveBookingDetails = bookingDetails;
    },

    // Stores the updated fields of active booking details
    'set-updated-fields'(state, fields) {
        state.updatedFields = fields;
    },

    'set-isField-updated'(state, text = '') {
        state.isFieldUpdated = !state.isFieldUpdated;
        state.successMessage = text;
    },
};

const actions = {
    async getAgents({ commit }) {

        try {
            const cachedAgents = localStorage.getItem('agents');

            if (cachedAgents) {
                const parsedAgents = JSON.parse(cachedAgents);

                if (Array.isArray(parsedAgents) && parsedAgents.length > 0) {
                    commit('set-agent-list', parsedAgents);
                    return;
                } else {
                    localStorage.removeItem('agents');
                }
            }

            const res = await mayaClient.get('/auth/user/agents');
            localStorage.setItem('agents', JSON.stringify(res));
            commit('set-agent-list', res);
        } catch {
            localStorage.removeItem('agents');
            commit('set-error', 'Failed to load agents');
        }
    },

    async getBookingDetails({ commit }, bookingId) {
        commit('reset-global-status');
        commit('set-loading', true);
        const res = await mayaClient.get(
            '/booking/details?booking-id=' + bookingId,
        );
        if (res.Booking) {
            commit('update-booking', res);
            commit('set-initial-active-booking-details', res.Booking);
        } else if (res.DisplayMsg) {
            commit('set-error', res.DisplayMsg + ' ( ' + res.ErrorMsg + ' )');
        }
        commit('set-loading', false);
    },

    async getPaymentLink({ dispatch, commit }, reqBody) {
        commit('reset-global-status');
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
        commit('reset-global-status');
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

    async updateBookingDetails({ commit, dispatch, state }, reqBody) {
        commit('reset-global-status');
        commit('set-loading', true);
        reqBody = { Booking: reqBody, UpdatedFields: state.updatedFields };
        const res = await mayaClient.post('/booking/update', reqBody);
        if (res.Success) {
            dispatch('getBookingDetails', reqBody.Booking.ID);
            commit('set-updated-fields', []);
        } else if (res.DisplayMsg) {
            commit('set-error', res.DisplayMsg + ' ( ' + res.ErrorMsg + ' )');
        }
        commit('set-loading', false);
    },

    async getActiveBooking({ commit }) {
        commit('reset-global-status');
        // Check if activeBookings already has data
        if (state.activeBookings && state.activeBookings.length > 0) {
            return;
        }
        commit('set-loading', true);
        const res = await mayaClient.get('/internal/active-bookings');
        if (res.DisplayMsg) {
            commit('set-error', res.DisplayMsg + ' ( ' + res.ErrorMsg + ' )');
        } else {
            commit('set-active-bookings', res);
        }
        commit('set-loading', false);
    },

    // Update Search Text
    updateSearchText({ commit }, bookingId) {
        commit('set-search-text', bookingId);
    },

    // Reset booking details to null
    resetBookingDetails({ commit }) {
        commit('update-booking', null);
    },

    setUpdatedFields({ commit }, fields) {
        commit('set-updated-fields', fields);
    },

    async changePaymentType({ commit }, { paymentID, paymentType }) {
        commit('reset-global-status');
        const reqBody = { type: paymentType };
        const res = await mayaClient.patch(
            `/payment/${paymentID}/type`,
            reqBody,
        );

        if (res?.DisplayMsg) {
            commit('set-error', res.DisplayMsg + ' ( ' + res.ErrorMsg + ' )');
        } else if (res?.Success) {
            commit('set-isField-updated', 'Payment type update successfully!');
        }
    },

    async createRefund({ commit }, refundData) {
        commit('reset-global-status');
        commit('set-loading', true);
        const res = await mayaClient.post('/payment/refund', refundData);
        if (res.DisplayMsg) {
            commit('set-error', res.DisplayMsg + ' ( ' + res.ErrorMsg + ' )');
        } else if (res.Success) {
            commit('set-success', 'Refund was initiated successfully');
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
