import { getSpotRequestStatusLabel as getSpotStatus } from "../../constant/enums";
import { getParkingSizeLabel as getParkingSize } from "../../constant/enums";
import { getRentUnitLabel as getRentUnit } from "../../constant/enums";
import { getSiteTypeLabel as getSiteType } from "../../constant/enums";

const state = {
    editField: null,
    formdataSO: {
        userName: '',
        spotId: '',
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
    'setFormData'(state, formData) {
        state.formdataSO = { ...state.formdataSO, ...formData.SO };
        state.formdataRent = { ...state.formdataRent, ...formData.Rent };
        state.formdataBooking = { ...state.formdataBooking, ...formData.Booking };
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

    // Helper function for parking size label retrieval
    getParkingSize(value) {
        return ParkingSizeEnum[value];
    },


    // Fetch data from API when the webpage is mounted
    initState({ commit, dispatch }) {
        
        // API call for GET, not completed as of now  
        const hardcodedInfo = {
            
            "ID": 123,
            "Owner": {
                "FullName": "Sud",
                "EmailID": "sud@gmai.com",
                "Mobile": "8092996057"
            },
            "Name": "Site Name",
            "Latitude": 12.123,
            "Longitude": 12.123,
            "BaseAmount": 3000,
            "TotalSlots": 3,
            "Address": "Address",
            "RentUnit": 1,
            "UserName": "sud",
            "City": "Bengaluru",
            "Area": "Area",
            "Size": 1,  
            "Type": 1,  
            "StartDate": "2024-10-12T11:37:22.6779781Z",
            "EndDate": "2024-10-12T11:37:22.6779781Z",
            "MinDuration": "2 months",
            "SpotImages": [
                "url1",
                "url2"
            ],
            "Status": 1,
            "Remark": "Remark",
            "LastCallDate": "2024-10-12T11:37:22.6779781Z"

        };
        const formData = {
            SO: {
                spotId: hardcodedInfo.ID,
                userName: hardcodedInfo.UserName,
                latitude: hardcodedInfo.Latitude,
                longitude: hardcodedInfo.Longitude,
                city: hardcodedInfo.City,
                area: hardcodedInfo.Area,
                fullName: hardcodedInfo.Owner.FullName,
                mobile: hardcodedInfo.Owner.Mobile,
                address: hardcodedInfo.Address,
                email: hardcodedInfo.Owner.EmailID,
            },
            Rent: {
                totalSlots: hardcodedInfo.TotalSlots,
                baseAmount: hardcodedInfo.BaseAmount, 
                rentUnit: getRentUnit(hardcodedInfo.RentUnit),
                parkingSize: getParkingSize(hardcodedInfo.Size),
                siteType: getSiteType(hardcodedInfo.Type),
            },
            Booking: {
                duration: hardcodedInfo.MinDuration,
                startDate: hardcodedInfo.StartDate,
                remark: hardcodedInfo.Remark,
                spotrequestStatus: getSpotStatus(hardcodedInfo.Status),
            },
        };
        console.log(hardcodedInfo);
        commit('setFormData', formData);
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
    }
    // -------------WORKING STAGE-------------------------
    // submitForm() {
    //     // Validate form fields
    //     dispatch('validateFormFields');

    //     if (dispatch('hasErrors')) {
    //         commit('set-global-error', 'Please correct the errors before submitting.');
    //         return;
    //     }
    //     commit('save-form-data');
    //     const response =  await mayaClient.post('/endpoint', updateHar);

    // }
    // -------------------------------------------
};
export default {
    namespaced: true,
    state,
    mutations,
    actions,
};