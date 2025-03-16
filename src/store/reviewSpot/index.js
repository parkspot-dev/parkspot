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
        spotImagesList: [],
        thumbnailImage: '',
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
    isLoading: false,
    latlongError: '',
    mobileError: '',
    spotImagesError: [],
    status: 'none', // none, error, success
    statusMessage: '',
    updatedFields: [],
};

const mutations = {
    'set-error'(state, { field, message, messageObject }) {
        if (Array.isArray(state[field]) && messageObject) {
            state[field] = messageObject;
        } else {
            state[field] = message;
        }
    },
    'set-error-msg'(state, errorMessage) {
        state.status = 'error';
        state.statusMessage = errorMessage;
    },
    'set-success-msg'(state, successMessage) {
        state.status = 'success';
        state.statusMessage = successMessage;
    },
    'reset-global-status'(state) {
        state.status = 'none';
        state.statusMessage = '';
    },
    'set-loading'(state, isLoading) {
        state.isLoading = isLoading;
    },
    'set-form-data'(state, formData) {
        state.SO = { ...state.SO, ...formData.SO };
        state.Rent = { ...state.Rent, ...formData.Rent };
        state.Booking = { ...state.Booking, ...formData.Booking };
    },
    'set-updated-fields'(state, fields) {
        state.updatedFields = fields;
    },
};

const actions = {
    // Validate Latitude and Longitude type
    validateLatLong({ commit, state }) {
        const input = state.SO.latlong;
        // Check for empty input
        if (!input || typeof input !== 'string') {
            commit('set-error', {
                field: 'latlongError',
                message:
                    'Latitude and longitude are required and must be a non-empty string.',
            });
            return;
        }
        // Split input into latitude and longitude
        const [latitudeString, longitudeString] = input
            .split(',')
            .map((str) => str.trim());
        // Check if input has exactly one comma and valid components
        if (
            !latitudeString ||
            !longitudeString ||
            input.split(',').length !== 2
        ) {
            commit('set-error', {
                field: 'latlongError',
                message:
                    'Latitude and longitude must be separated by exactly one comma. Eg. 10.00, 12.00',
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
                message:
                    'Latitude and longitude must be valid floats separated by a comma. Eg. 10.00, 12.00',
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

    validateSpotImageUrl({ commit, state }, index) {
        const url = state.SO.spotImagesList[index].trim();
        const currentErrors = [...state.spotImagesError];
        if (url === '') {
            currentErrors[index] = 'URL cannot be empty';
        } else {
            const urlPattern = new RegExp(
                '^(https?:\\/\\/)?' + // protocol
                '((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|' + // domain name
                '(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*' + // port and path
                '(\\?[;&a-zA-Z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-zA-Z\\d_]*)?$', // fragment locator
                'i'
            );
            if (!urlPattern.test(url)) {
                currentErrors[index] = 'Invalid URL format';
            } else {
                currentErrors[index] = '';
            }
        }
        commit('set-error', { field: 'spotImagesError', messageObject: currentErrors });
    },

    // Fetch spotdata [using spotId fetched from url] when the webpage is mounted
    async fetchSpotDetails({ commit, state, dispatch }) {
        commit('set-loading', true);
        const spotInfo = await mayaClient.get(
            `/owner/spot-request?spot-id=${state.SO.spotId}`,
        );
        const spotImages = (spotInfo.SpotImages || []).map(image => image.trim());
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
                spotImagesList: spotImages,
                thumbnailImage: spotInfo.SpotImageURI,
            },
            Rent: {
                totalSlots: spotInfo.TotalSlots,
                baseAmount: spotInfo.BaseAmount,
                rentUnit: spotInfo.RentUnit,
                parkingSize: spotInfo.Size,
                siteType: spotInfo.Type,
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
        dispatch('initializeSpotImagesError');
        commit('set-loading', false);
    },

    // Initialize spotImagesError as empty array of same length
    initializeSpotImagesError({ commit, state }) {
        const spotImages = state.SO.spotImagesList || [];
        const spotImagesErrorInit = Array(spotImages.length).fill('');
        commit('set-error', { field: 'spotImagesError', messageObject: spotImagesErrorInit });
    },

    // Validate all the Errors
    async validateFormFields({ dispatch }) {
        await Promise.all([
            dispatch('validateMobile'),
            dispatch('validateLatLong'),
            dispatch('validateSpotImagesErrors'),
        ]);
    },

    // Validate all spot image URLs
    async validateSpotImagesErrors({ state, dispatch }) {
        const validations = state.SO.spotImagesList.map((_, index) =>
            dispatch('validateSpotImageUrl', index)
        );
        await Promise.all(validations);
    },

    // Check for errors in the state
    hasErrors({ state }) {
        const spotImageErrors = state.spotImagesError.some(err => err && err !== '');
        return state.mobileError || state.latlongError || spotImageErrors;
    },

    // Validates form fields and checks for errors.
    async handleFormErrors({ dispatch, commit }) {
        commit('reset-global-status');
        await dispatch('validateFormFields');
        if (await dispatch('hasErrors')) {
            commit(
                'set-error-msg',
                'Please fix the errors in the form before submitting.',
            );
            return false;
        }
        return true;
    },

    // Updates the spot request details
    async updateSpotRequest({ dispatch, state }) {
        const [latitude, longitude] = state.SO.latlong
            .split(',')
            .map(parseFloat);
        const trimmedSpotImages = state.SO.spotImagesList.map(image => image.trim());
        const spotRequest = {
            Address: state.SO.address,
            Area: state.SO.area,
            BaseAmount:
                state.Rent.baseAmount !== null
                    ? parseFloat(state.Rent.baseAmount)
                    : 0.0,
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
            TotalSlots:
                state.Rent.totalSlots !== null
                    ? parseInt(state.Rent.totalSlots)
                    : 0,
            Type: state.Rent.siteType,
            UserName: state.SO.userName,
            SpotImages: trimmedSpotImages,
            SpotImageURI: state.SO.thumbnailImage,
            FieldMask: await dispatch('mapFieldMask'),
        };
        return await mayaClient.patch('/owner/spot-request', spotRequest);
    },

    // Maps updated fields to their API equivalents
    mapFieldMask({ state }) {
        const fieldMask = state.updatedFields.map((field) => {
            switch (field) {
                case 'address':
                    return 'Address';
                case 'area':
                    return 'Area';
                case 'baseAmount':
                    return 'BaseAmount';
                case 'city':
                    return 'City';
                case 'email':
                    return 'EmailID';
                case 'endDate':
                    return 'EndDate';
                case 'fullName':
                    return 'FullName';
                case 'lastCallDate':
                    return 'LastCallDate';
                case 'duration':
                    return 'MinDuration';
                case 'mobile':
                    return 'Mobile';
                case 'remark':
                    return 'Remark';
                case 'rentUnit':
                    return 'RentUnit';
                case 'parkingSize':
                    return 'Size';
                case 'startDate':
                    return 'StartDate';
                case 'spotrequestStatus':
                    return 'Status';
                case 'totalSlots':
                    return 'TotalSlots';
                case 'siteType':
                    return 'Type';
                case 'userName':
                    return 'UserName';
                case 'thumbnailImage':
                    return 'SpotImageURI';
                case 'spotImagesList':
                    return 'SpotImages';
            }
        });
        fieldMask.push('ID', 'UserName');
        if (state.updatedFields.includes('latlong')) {
            fieldMask.push('Latitude', 'Longitude');
        }
        return fieldMask;
    },

    // saveForm validates form data for errors and updates the spot request data on the backend (for temporary saving or drafts)
    async saveForm({ dispatch, commit }) {
        const isValid = await dispatch('handleFormErrors');
        if (!isValid) {
            return;
        }
        const response = await dispatch('updateSpotRequest');
        if (response.DisplayMsg) {
            // Network issues or server errors could cause the API call to fail.
            commit('set-error-msg', response.DisplayMsg);
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
        const response = await mayaClient.post(
            `/owner/spot-update?spot-id=${state.SO.spotId}`,
        );
        if (response.DisplayMsg) {
            // Network issues or server errors could cause the API call to fail.
            commit('set-error-msg', response.DisplayMsg);
        } else {
            commit(
                'set-success-msg',
                'Your request was submitted successfully',
            );
        }
        return response;
    },

    setUpdatedFields({ commit }, fields) {
        commit('set-updated-fields', fields);
    },

    setSpotImageError({ commit }, { index, message }) {
        const updatedErrors = [...state.spotImagesError];
        updatedErrors[index] = message;
        commit('set-error', {
            field: 'spotImagesError',
            message: updatedErrors,
        });
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
