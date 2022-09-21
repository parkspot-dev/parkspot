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

    'update-login'(state, loginData = {}) {
        state.login = { ...loginData, FirebaseAccessToken: 'test1' };
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
        // prettier-ignore
        const req = {
            UserName    : 'dummy_' + state.contactForm.fullname + '_' + Date.now(),
            Password    : 'dummy@123',
            FullName    : state.contactForm.fullname,
            City        : state.locationDetails.locDetails.locName,
            EmailID     : state.contactForm.email,
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
        // prettier-ignore
        const req = {
            ContactNo               : state.contactForm.cno,
            UserName                : state.login.Username,
            Owner                   : state.kycForm.owner,
            OwnerName               : 'none',
            OwnerContactNo          : 'none',
            Relationship            : 'none',
            OwnershipDocument       : state.kycForm.documentData,
            IdentityDocument        : state.kycForm.documentData,
            OwnershipDocumentImage  : state.kycForm.imgData,
            IdentityDocumentImage   : state.kycForm.imgData,
        };

        mayaClient.post('/kyc', req);
    },

    contact({ state }) {
        const convertedAmenities = state.additionalInfo.amenities.toString();

        // prettier-ignore
        const req = {
            User: {
                UserName    : state.login.Username, //  only for logged in user
                FullName    : state.contactForm.fullname,
                City        : state.locationDetails.locDetails.locName,
                EmailID     : state.contactForm.email,
                Mobile      : state.contactForm.cno,
            },
            Comments        : 'Spot Registered',
            RentDetails: {
                VehicleType         : '',
                Rate                : state.additionalInfo.rent,
                MinBookingDuration  : state.additionalInfo.minDur,
                Availability        : '',
                SpecialService      : convertedAmenities, //  None/Camera/Security
                TnC                 : 'I Agree',
                Address             : state.locationDetails.locDetails.locName,

            },
        };

        mayaClient.post('/contact', req);
    },

    onlyContact({ state }) {
        const comments = 'From the Home Page ----->' + state.contactForm.msg;
        // prettier-ignore
        const req = {
            User: {
                FullName    : state.contactForm.fullname,
                EmailID     : state.contactForm.email,
                Mobile      : state.contactForm.cno,
            },
            Comments        : comments,
        };

        mayaClient.post('/contact', req);
    },

    async requestSpot({ state }) {
        // prettier-ignore
        const req = {
            Name        : state.contactForm.fullname,
            Mobile      : state.contactForm.cno,
            EmailID     : state.contactForm.email,
            Country     : state.locationDetails.locDetails.country,
            State       : state.locationDetails.locDetails.state,
            City        : state.locationDetails.locDetails.city,
            Latitude    : state.locationDetails.lnglat.lat,
            Longitude   : state.locationDetails.lnglat.lng,
            CarModel    : state.preference.carModel,
            Duration    : state.preference.minDur,
            Landmark    : state.locationDetails.locDetails.city.country,
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
