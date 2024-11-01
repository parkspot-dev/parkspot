import { mayaClient } from '@/services/api';
import { getParkingRequestStatus as parkingStatus } from '@/constant/enums';
const state = {
    //     Example:
    //     "Name":     "test2",
    //     "Mobile":   "8092996057",
    //     "Latitude":  11.1234567,
    //     "Longitude": 22.123456789,
    //     "City":      "Varansai",
    //     "Email":     "sds@gmgail.com",
    //     "Car":       "string",
    //     "Address":   "house 5",
    //     "Remark":    "Ish",
    //     "Duration":  "2 hours"
    //
    formData: {
        Name: '',
        Mobile: '',
        Latitude: null,
        Longitude: null,
        City: '',
        Email: '',
        Car: '',
        Address: '',
        Remark: '',
        Duration: '',
    },
    durationError: '',
    mobileError: '',
    latitudeError: '',
    longitudeError: '',
    remarkError: '',
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
    // Validate Duration length
    validateDuration({ commit, state }) {
        if (state.formData.Duration.length > 50) {
            commit('set-error', {
                field: 'durationError',
                message: 'Duration should be less than 50 characters.',
            });
        } else {
            commit('set-error', { field: 'durationError', message: '' });
        }
    },

    // Validate Latitude type
    validateLatitude({ commit, state }) {
        const latitudeValue = parseFloat(state.formData.Latitude);
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
        const longitudeValue = parseFloat(state.formData.Longitude);
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
        if (!mobilePattern.test(state.formData.Mobile)) {
            commit('set-error', {
                field: 'mobileError',
                message: 'Mobile number must be exactly 10 digits.',
            });
        } else {
            commit('set-error', { field: 'mobileError', message: '' });
        }
    },

    // Validate Remark length
    validateRemark({ commit, state }) {
        if (state.formData.Remark.length > 200) {
            commit('set-error', {
                field: 'remarkError',
                message: 'Remark cannot exceed 200 characters.',
            });
        } else {
            commit('set-error', { field: 'remarkError', message: '' });
        }
    },

    // Validate all the Errors
    async validateFormFields({ dispatch }) {
        await Promise.all([
            dispatch('validateDuration'),
            dispatch('validateLatitude'),
            dispatch('validateLongitude'),
            dispatch('validateMobile'),
            dispatch('validateRemark'),
        ]);
    },

    // Check for errors in the state
    hasErrors({ state }) {
        return (
            state.mobileError ||
            state.latitudeError ||
            state.longitudeError ||
            state.durationError ||
            state.remarkError
        );
    },

    // Check if there is an assigned request for the mobile ID
    async checkAssignedRequest({ state }) {
        const agentInfo = await mayaClient.get(
            `/internal/parking-requests?mobile=${state.formData.Mobile}`,
        );
        for (let i = 0; i < agentInfo.length; i++) {
            if (
                agentInfo[i].Agent !== 'NA' &&
                [
                    parkingStatus.RequestRegistered,
                    parkingStatus.RequestProcessing,
                    parkingStatus.RequestSpotSuggested,
                ].includes(agentInfo[i].status)
            ) {
                return agentInfo[i].Agent; // Return the assigned agent's name
            }
        }

        return null; // No assigned request found
    },

    // Submit the parking request
    async submitParkingRequest({ state }) {
        const parkingRequest = {
            Name: state.formData.Name,
            Mobile: state.formData.Mobile,
            EmailId: state.formData.Email,
            City: state.formData.City,
            CarModel: state.formData.Car,
            Comments: `[AD] ${state.formData.Remark}`, // Prepend [AD] with Remarks
            Latitude: state.formData.Latitude,
            Longitude: state.formData.Latitude,
            Duration: state.formData.Duration,
            LandMark: state.formData.Address,
        };
        return await mayaClient.post('/owner/parking-request', parkingRequest);
    },

    // Submit the form
    async submitForm({ dispatch, commit }) {
        commit('reset-global-Error');

        // Validate form fields
        await dispatch('validateFormFields');

        // Check for errors and handle if any exist
        if (await dispatch('hasErrors')) {
            commit(
                'set-global-error',
                'Please fix the errors in the form before submitting.',
            );
            return;
        }

        // Check if the mobile ID has already been assigned
        const assignedAgent = await dispatch('checkAssignedRequest');
        if (assignedAgent) {
            commit(
                'set-global-error',
                `This mobile ID has already been assigned to ${assignedAgent}`,
            );
            return;
        }

        // Submit the parking request
        const response = await dispatch('submitParkingRequest');
        commit('set-global-error', 'Your request was registered successfully');

        return response.data;
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
