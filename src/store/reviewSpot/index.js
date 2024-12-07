import { getSpotApprovalStatusLabel as getSpotStatus } from "../../constant/enums";
import { getParkingSizeLabel as getParkingSize } from "../../constant/enums";
import { getRentUnitLabel as getRentUnit } from "../../constant/enums";
import { getSiteTypeLabel as getSiteType } from "../../constant/enums";
import { mayaClient } from '@/services/api';

const state = {
    formdataSO: {
        userName: '',
        spotId: null,
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
        duration: '',
        spotrequestStatus: '',
        remark: '',
        },
    mobileError: '',
    latitudeError: '',
    longitudeError: '',
    hasError: false,
    errorMessage: '',
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
    'reset-global-Error'(state) {
        state.hasError = false;
        state.errorMessage = '';
    },
    'set-loading'(state, isLoading) {
        state.isLoading = isLoading;
    },
    'setFormData'(state, formData) {
        state.formdataSO = { ...state.formdataSO, ...formData.SO };
        state.formdataRent = { ...state.formdataRent, ...formData.Rent };
        state.formdataBooking = { ...state.formdataBooking, ...formData.Booking };
    },
    'update_latitude'(state, latitude) {
        state.formdataSO.latitude = latitude;
    },
    'update_longitude'(state, longitude) {
        state.formdataSO.longitude = longitude;
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
            commit('update_latitude', latitudeValue);
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
            commit('update_longitude', longitudeValue);
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

    // Gets the parking size label from the ParkingSizeEnum based on the given value.
    getParkingSize(value) {
        return ParkingSizeEnum[value];
    },

    // Fetch data [using spotId fetched from url] when the webpage is mounted
    async fetchSpotDetails({ commit, state }) {
        commit('set-loading', true);
        const spotInfo = await mayaClient.get
            (`/owner/spot-request?spot-id=${state.formdataSO.spotId}`);
        const formData = {
            SO: {
                spotId: spotInfo.ID,
                userName: spotInfo.UserName,
                latitude: spotInfo.Latitude,
                longitude: spotInfo.Longitude,
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
                rentUnit: getRentUnit(spotInfo.RentUnit),
                parkingSize: getParkingSize(spotInfo.Size),
                siteType: getSiteType(spotInfo.Type),
            },
            Booking: {
                duration: spotInfo.MinDuration,
                startDate: spotInfo.StartDate,
                endDate: spotInfo.EndDate,
                spotrequestStatus: getSpotStatus(spotInfo.Status),
                remark: spotInfo.Remark,
                lastCallDate: spotInfo.LastCallDate,
            },
        };
        commit('setFormData', formData);
        commit('set-loading', false); 
    },

    // Validate all the Errors
    async validateFormFields({ dispatch }) {
        await Promise.all([
            dispatch('validateLatitude'),
            dispatch('validateLongitude'),
            dispatch('validateMobile'),
        ]);
    },

    // Check for errors in the state
    hasErrors({ state }) {
        return (
            state.mobileError ||
            state.latitudeError ||
            state.longitudeError
        );
    },
};
export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
