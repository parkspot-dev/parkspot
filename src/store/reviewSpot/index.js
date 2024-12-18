import { getSpotRequestStatusLabel as getSpotStatus } from "../../constant/enums";
import { getParkingSizeLabel as getParkingSize } from "../../constant/enums";
import { getRentUnitLabel as getRentUnit } from "../../constant/enums";
import { getSiteTypeLabel as getSiteType } from "../../constant/enums";
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
    'set-form-data'(state, formData) {
        state.SO = { ...state.SO, ...formData.SO };
        state.Rent = { ...state.Rent, ...formData.Rent };
        state.Booking = { ...state.Booking, ...formData.Booking };
    },
    'update-latlong'(state, latlong) {
        state.SO.latlong = latlong;
    }
};

const actions = {

    // Validate Latitude and Longitude type
    validateLatLong({ commit, input }) {
        const [latitudeString, longitudeString] = input.split(",");
        // Trim any leading or trailing whitespace
        const latitude = parseFloat(latitudeString.trim());
        const longitude = parseFloat(longitudeString.trim());

        // Check if both latitude and longitude are valid numbers (not NaN)
        if (isNaN(latitude) || isNaN(longitude)) {
            commit('set-error', {
                field: 'latLongError', // Use a combined error field
                message: 'Latitude and longitude must be valid floats separated by a comma. Eg. 10.00, 12.00',
            });
        }
        else {
            commit('set-error', { field: 'latlongError', message: '' });
            // const latlong = commit('combine-lat-long', latitude, longitude);
            // commit('update-latlong', latlong);
        }
    },

    // Validate Mobile length
    validateMobile({ commit, state }) {
        const mobilePattern = /^\d{10}$/;
        if (!mobilePattern.test(state.SO.mobile)) {
            commit('set-error', {
                field: 'mobileError',
                message: 'Mobile number must be exactly 10 digits.',
            });
        } else {
            commit('set-error', { field: 'mobileError', message: '' });
        }
    },

    combineLatLong(latitude, longitude) {
        return `${latitude},${longitude}`;
    },

    // Fetch data [using spotId fetched from url] when the webpage is mounted
    async fetchSpotDetails({ commit, state }) {
        commit('set-loading', true);
        const spotInfo = await mayaClient.get
            (`/owner/spot-request?spot-id=${state.SO.spotId}`);
        const formData = {
            SO: {
                spotId: spotInfo.ID,
                userName: spotInfo.UserName,
                // latlong: combineLatLong(spotInfo.latitude, spotInfo.longitude),
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
        commit('set-form-data', formData);
        commit('set-loading', false); 
    },

    // Validate all the Errors
    async validateFormFields({ dispatch }) {
        await Promise.all([
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
