import moment from 'moment';

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
        state.formdataBooking = {...state.formdataBooking,...formData.Booking };
    },
};

const actions = {
    // Function to format ISO date string to readable format
    // formatDateToString(_, isoDate) {
    //     if (isoDate === '0001-01-01T00:00:00Z') {
    //         return '--'; // Handle empty or null-like dates
    //     }
    //     return moment(isoDate).format('MMM Do YYYY, h:mm:ss A');
    // },

    // // Function to convert a readable date string back to ISO format
    // convertStringToISO(_, dateString) {
    //     const isoDate = moment(dateString, 'MMM Do YYYY, h:mm:ss A').toISOString();
    //     return isoDate;
    // },
    
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

    // Fetch data from API when the webpage is mounted
    initState({ commit, dispatch }) {
        
        // API call for get not completed as of now  
        const hardcodedInfo = {
            ID: 123,
            Owner: { FullName: "Sud", EmailID: "sud@gmai.com", Mobile: "8092996057" },
            UserName: "sud",
            Latitude: 12.123,
            Longitude: 12.123,
            City: "Bengaluru",
            Area: "Area",
            Address: "Address",
            RentUnit: 1,
            TotalSlots: 3,
            StartDate: "2025-10-12T11:37:22.6779781Z",
            EndDate: "2025-10-12T11:37:22.6779781Z",
            MinDuration: "2 months",
            Remark: "Remark",
            LastCallDate: "2025-10-12T11:37:22.6779781Z",
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
                baseAmount: hardcodedInfo.RentUnit, // not given
                rentUnit: hardcodedInfo.RentUnit,
            },
            Booking: {
                startDate: new Date(moment(hardcodedInfo.StartDate).format('MMM Do YYYY')),
                endDate: moment(hardcodedInfo.EndDate).format('MMM Do YYYY'),
                // lastCallDate: this.formatDateToString(null, hardcodedInfo.LastCallDate),
                duration: hardcodedInfo.MinDuration,
                remark: hardcodedInfo.Remark,
            },
        };
        console.log(formData.Booking.startDate);
        console.log(hardcodedInfo.StartDate);
        // console.log()
        // console.log(lastCallDate);
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