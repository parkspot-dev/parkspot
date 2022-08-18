import { mayaClient } from '@/services/api';

const state = {
    contactForm: {},
    kycForm: {},
    additionalInfo: {},
    login: {},
    locationDetails: {},
    preference: {},
};

const getters = {};

const mutations = {
    'update-contact'(state, data = {}) {
        state.contactForm = data;
    },

    'update-kyc'(state, data = {}) {
        state.kycForm = data;
    },

    'update-additional-info'(state, data = {}) {
        state.additionalInfo = data;
    },

    'update-login'(state, data = {}) {
        state.login = data;
    },

    'update-location-details'(state, data = {}) {
        state.locationDetails = data;
    },

    'update-preference'(state, data = {}) {
        state.preference = data;
    },
};

const actions = {
    register({ commit, state }) {
        const req = {
            UserName: 'dummy_' + state.contactForm.fullname + Date.now(),
            Password: 'dummy@123',
            FullName: state.contactForm.fullname,
            City: state.locationDetails.locName,
            EmailID: state.contactForm.email,
        };
        const loginReq = {
            Username: req.UserName,
            Password: req.Password,
        };
        commit('update-login', loginReq);
        mayaClient.post('/auth/register', req);
    },

    login({ state }) {
        mayaClient.post('/auth/login', state.login);
    },

    kyc({ state }) {
        const req = {
            ContactNo: state.contactForm.cno,
            UserName: state.login.UserName,
            Owner: state.kycForm.radioData,
            OwnerName: 'none',
            OwnerContactNo: 'none',
            Relationship: 'none',
            OwnershipDocument: state.kycForm.documentData,
            IdentityDocument: state.kycForm.documentData,
            OwnershipDocumentImage: state.kycForm.imgData,
            IdentityDocumentImage: state.kycForm.imgData,
        };
        mayaClient.patch('/kyc', req);
    },

    contact({ state }) {
        let convertedAmenities;
        state.additionalInfo.amenities.forEach((data) => {
            convertedAmenities += data + ',';
        });
        convertedAmenities = convertedAmenities.substring(
            0,
            convertedAmenities.length - 1,
        );
        const req = {
            User: {
                UserName: state.login.UserName, //only for logged in user
                FullName: state.contactForm.fullname,
                City: state.locationDetails.locName,
                EmailID: state.contactForm.email,
                Mobile: state.contactForm.cno,
            },
            Comments: 'Spot Registered',
            RentDetails: {
                VehicleType: '',
                Rate: state.additionalInfo.rent,
                MinBookingDuration: state.additionalInfo.minDur,
                Availability: '',
                SpecialService: convertedAmenities, //None/Camera/Security
                TnC: 'I Agree',
                Address: state.locationDetails.locName,
            },
        };
        mayaClient.post('/contact', req);
    },

    onlyContact({ state }) {
        let comments = 'From the Home Page ----->' + state.contactForm.msg;
        const req = {
            User: {
                FullName: state.contactForm.fullname,
                EmailID: state.contactForm.email,
                Mobile: state.contactForm.cno,
            },
            Comments: comments,
        };
        mayaClient.post('/contact', req);
    },

    async requestSpot({ state }) {
        const req = {
            Name: state.contactForm.fullname,
            Mobile: state.contactForm.cno,
            EmailID: state.contactForm.email,
            Country: state.locationDetails.locDetails.country,
            State: state.locationDetails.locDetails.state,
            City: state.locationDetails.locDetails.city,
            Latitude: state.locationDetails.lnglat.lat,
            Longitude: state.locationDetails.lnglat.lng,
            CarModel: state.preference.CarModel,
            Duration: state.preference.minDur,
            Landmark: state.locationDetails.locDetails.city.country,
        };
        mayaClient.post('/owner/parking-request', req);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
