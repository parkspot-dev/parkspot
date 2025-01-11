import { mayaClient } from '@/services/api';

const state = {
    SO: {
        userName: '',
        spotId: null,
        fullName: '',
        mobile: '',
        email: '',
        address: '',
        city: '',
        area: '',
        latlong: '',
      },
      Rent: {
        totalSlots: null,
        baseAmount: null,
        rentUnit: '',
        parkingSize: '',
        siteType: '',
      },
      Booking: {
        startDate: '',
        endDate: '',
        lastCallDate: '',
        duration: '',
        spotrequestStatus: '',
        remark: '',
        },
    mobileError: '',
    latlongError: '',
    hasError: false,
    hasSuccess: false,
    errorMessage: '',
    successMessage: '',
    isLoading: false,
};

const mutations = {
    'set-error'(state, { field, message }) {
        state[field] = message;
    },
    'set-global-error'(state, errorMessage) {
        state.hasError = true;
        state.errorMessage = errorMessage;
    },
    'set-success-msg'(state, successMessage) {
        state.hasSuccess = true;
        state.successMessage = successMessage;
    },
    'reset-global-Error'(state) {
        state.hasError = false;
        state.errorMessage = '';
    },
    'reset-success'(state) {
        state.hasSuccess = false;
        state.successMessage = '';
    },
    'set-loading'(state, isLoading) {
        state.isLoading = isLoading;
    },
    'set-form-data'(state, formData) {
        state.SO = { ...state.SO, ...formData.SO };
        state.Rent = { ...state.Rent, ...formData.Rent };
        state.Booking = { ...state.Booking, ...formData.Booking };
    }
};

const actions = {
    // Validate Latitude and Longitude type
    validateLatLong({ commit, state }) {
        const input = state.SO.latlong;
        // Check for empty input
        if (!input || typeof input !== 'string') {
            commit('set-error', {
                field: 'latlongError',
                message: 'Latitude and longitude are required and must be a non-empty string.',
            });
            return;
        }
        // Split input into latitude and longitude
        const [latitudeString, longitudeString] = input.split(",").map((str) => str.trim());
        // Check if input has exactly one comma and valid components
        if (!latitudeString || !longitudeString || input.split(",").length !== 2) {
            commit('set-error', {
                field: 'latlongError',
                message: 'Latitude and longitude must be separated by exactly one comma. Eg. 10.00, 12.00',
            });
            return;
        }
        // Convert strings to floats
        const latitude = parseFloat(latitudeString);
        const longitude = parseFloat(longitudeString);
        // Check if parsed values are valid numbers
        if (isNaN(latitude) || isNaN(longitude)) {
            commit('set-error', {
                field: 'latlongError',
                message: 'Latitude and longitude must be valid floats separated by a comma. Eg. 10.00, 12.00',
            });
            return;
        }
        commit('set-error', { field: 'latlongError', message: '' });
    },

    // Validate Mobile length
    validateMobile({ commit, state }) {
        const mobilePattern = /^\d{10}$/;
        if (!mobilePattern.test(state.SO.mobile)) {
            commit('set-error', {
                field: 'mobileError',
                message: 'Mobile number must be exactly 10 digits.',
            });
            return;
        }
        commit('set-error', { field: 'mobileError', message: '' });
    },

    // Fetch spotdata [using spotId fetched from url] when the webpage is mounted
    async fetchSpotDetails({ commit, state }) {
        commit('set-loading', true);
        const spotInfo = await mayaClient.get
            (`/owner/spot-request?spot-id=${state.SO.spotId}`);
        const formData = {
            SO: {
                spotId: spotInfo.ID,
                userName: spotInfo.UserName,
                latlong: `${spotInfo.Latitude},${spotInfo.Longitude}`,
                city: spotInfo.City,
                area: spotInfo.Area,
                fullName: spotInfo.FullName,
                mobile: spotInfo.Mobile,
                address: spotInfo.Address,
                email: spotInfo.EmailID,
            },
            Rent: {
                totalSlots: spotInfo.TotalSlots,
                baseAmount: spotInfo.BaseAmount, 
                rentUnit: spotInfo.RentUnit,
                parkingSize: spotInfo.Size,
                siteType: spotInfo.Type
            },
            Booking: {
                duration: spotInfo.MinDuration,
                startDate: spotInfo.StartDate,
                endDate: spotInfo.EndDate,
                spotrequestStatus: spotInfo.Status,
                remark: spotInfo.Remark,
                lastCallDate: spotInfo.LastCallDate,
            },
        };
        commit('set-form-data', formData);
        commit('set-loading', false); 
    },

    // Validate all the Errors
    async validateFormFields({ dispatch }) {
        await Promise.all([
            dispatch('validateMobile'),
            dispatch('validateLatLong'),
        ]);
    },

    // Check for errors in the state
    hasErrors({ state }) {
        return (
            state.mobileError ||
            state.latlongError
        );
    },

    // Validates form fields and checks for errors.
    async handleFormErrors({ dispatch, commit }) {
        commit('reset-global-Error');
        await dispatch('validateFormFields');
        if (await dispatch('hasErrors')) {
            commit('set-global-error', 'Please fix the errors in the form before submitting.');
            return false; 
        }
        return true; 
    },

    // Updates the spot request details
    async updateSpotRequest({ state }) {
        const [latitude, longitude] = state.SO.latlong.split(',').map(parseFloat);
        const spotRequest = {
            Address: state.SO.address,
            Area: state.SO.area,
            BaseAmount: state.Rent.baseAmount !== null ? parseFloat(state.Rent.baseAmount) : 0.0,
            City: state.SO.city,
            Email: state.SO.email,
            EndDate: state.Booking.endDate,
            FullName: state.SO.fullName,
            ID: state.SO.spotId,
            LastCallDate: state.Booking.lastCallDate,
            Latitude: latitude,
            Longitude: longitude,
            MinDuration: state.Booking.duration,
            Mobile: state.SO.mobile,
            Remark: state.Booking.remark,
            RentUnit: state.Rent.rentUnit,
            Size: state.Rent.parkingSize,
            StartDate: state.Booking.startDate,
            Status: state.Booking.spotrequestStatus,
            TotalSlots: state.Rent.totalSlots !== null ? parseInt(state.Rent.totalSlots) : 0,
            Type: state.Rent.siteType,
            UserName: state.SO.userName,
        };
        return await mayaClient.patch('/owner/spot-request', spotRequest);
    },

    // saveForm validates form data for errors and updates the spot request data on the backend (for temporary saving or drafts)
    async saveForm({ dispatch, commit }) {
        const isValid = await dispatch('handleFormErrors');
        if (!isValid) {
            return;
        }
        commit('reset-success');
        const response = await dispatch('updateSpotRequest');
        if (response.DisplayMsg) {
            // Network issues or server errors could cause the API call to fail.
            commit('set-global-error', response.DisplayMsg);
        } else {
            commit('set-success-msg', 'Your request was saved successfully');
        }
        return response;
    },

    // Submits the spot request form for final processing after validating any errors and updating the backend data.
    async submitForm({ state, dispatch, commit }) {
        const isValid = await dispatch('handleFormErrors');
        if (!isValid) {
            return;
        }
        commit('reset-success');
        const response = await mayaClient.post(`/owner/spot-update?spot-id=${state.SO.spotId}`);
        if (response.DisplayMsg) {
            // Network issues or server errors could cause the API call to fail.
            commit('set-global-error', response.DisplayMsg);
        }
        else{
            commit('set-success-msg', 'Your request was submitted successfully');
        }
        return response;
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};