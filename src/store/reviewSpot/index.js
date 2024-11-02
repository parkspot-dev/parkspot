const state = {
    editField: null,
    formdataSO: {
        userName: 'Test',
        spotId: 'Test',
        fullName: '',
        mobile: '',
        email: '',
        address: '',
        city: '',
        area: '',
        latitude: null,
        longitude: null,
      },
      formdataRent: {
        totalSlots: null,
        baseAmount: null,
        rentUnit: '',
        parkingSize: '',
        siteType: '',
      },
      formdataBooking: {
        startDate: '',
        endDate: '',
        lastCallDate: '',
        minDuration: '',
        spotrequestStatus: '',
        remark: '',
        },
    mobileError: '',
    latitudeError: '',
    longitudeError: '',
    hasError: false,
    errorMessage: '',
};
const mutations = {
    'set-error'(state, { field, message }) {
        state[field] = message;
    },
    'set-global-error'(state, errorMessage) {
        state.hasError = true;
        state.errorMessage = errorMessage;
    },
    'reset-global-Error'(state) {
        state.hasError = false;
        state.errorMessage = '';
    },
};

const actions = {
    // Validate Latitude type
    validateLatitude({ commit, state }) {
        const latitudeValue = parseFloat(state.formdataSO.latitude);
        if (isNaN(latitudeValue)) {
            commit('set-error', {
                field: 'latitudeError',
                message: 'Latitude must be a valid float.',
            });
        } else {
            commit('set-error', { field: 'latitudeError', message: '' });
            state.formData.Latitude = latitudeValue;
        }
    },

    // Validate Longitude type
    validateLongitude({ commit, state }) {
        const longitudeValue = parseFloat(state.formdataSO.longitude);
        if (isNaN(longitudeValue)) {
            commit('set-error', {
                field: 'longitudeError',
                message: 'Longitude must be a valid float.',
            });
        } else {
            commit('set-error', { field: 'longitudeError', message: '' });
            state.formData.Longitude = longitudeValue;
        }
    },

    // Validate Mobile length
    validateMobile({ commit, state }) {
        const mobilePattern = /^\d{10}$/;
        if (!mobilePattern.test(state.formdataSO.mobile)) {
            commit('set-error', {
                field: 'mobileError',
                message: 'Mobile number must be exactly 10 digits.',
            });
        } else {
            commit('set-error', { field: 'mobileError', message: '' });
        }
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};