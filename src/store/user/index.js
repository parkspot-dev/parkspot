import { mayaClient } from '@/services/api';
import { auth } from '../../firebase';
import store from '../../store';
import {
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth';

const state = {
    user: null,
    userProfile: null,
    isAuthReady: false,
    loginModal: false,
    contactForm: {},
    kycForm: {},
    additionalInfo: {},
    login: {},
    locationDetails: {},
    preference: {},
    isLoading: false,
    isSavedProfileData: true,
    userLatLng: { lat: 12.9716, lng: 77.5946 }, // default location if user refused to share its location
};

const getters = {};

const mutations = {
    'update-user'(state, user) {
        state.user = user;
        if (user) {
            localStorage.setItem('PSAuthKey', user.accessToken);
        } else {
            localStorage.setItem('PSAuthKey', null);
        }
    },

    'update-user-profile'(state, userProfile) {
        userProfile['UserName'] = '';
        state.userProfile = userProfile;
    },

    'update-login-Modal'(state, loginModal) {
        state.loginModal = loginModal;
    },

    'update-auth-ready'(state, isAuthReady) {
        state.isAuthReady = isAuthReady;
    },

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

    'update-is-loading'(state, isLoading) {
        state.isLoading = isLoading;
    },

    'update-is-saved-profile-data'(state, isSavedProfileData) {
        state.isSavedProfileData = isSavedProfileData;
    },

    'update-user-info'(state, userInfo) {
        const { FullName, EmailID, Mobile, Type } = userInfo;
        state.userProfile['FullName'] = FullName;
        state.userProfile['EmailID'] = EmailID;
        state.userProfile['Mobile'] = Mobile;
        state.userProfile['Type'] = Type;
    },

    'set-user-lat-lng'(state, userLocation) {
        state.userLatLng = userLocation;
    },
};

const actions = {
    async loginWithGoogle({ commit, state }) {
        const gProvider = new GoogleAuthProvider();
        commit('update-is-loading', true);
        try {
            const res = await signInWithPopup(auth, gProvider);
            // todo remove commented code and console log
            // const credential = GoogleAuthProvider.credentialFromResult(res);
            // const token = credential.accessToken;
            const user = res.user;
            commit('update-user', user);
            commit('update-login-Modal', false);
            commit('update-is-loading', false);
        } catch (err) {
            const errorCode = err.code;
            const errorMessage = err.message;
            // The email of the user's account used.
            const email = err.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(err);
            console.log(errorCode, errorMessage, email, credential);
        }
    },

    async logOut({ commit, state }) {
        commit('update-is-loading', true);
        try {
            await signOut(auth);
            commit('update-user', null);
            commit('update-is-loading', false);
        } catch (err) {
            // todo write proper exception case
            throw new Error(err);
        }
    },

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

        mayaClient.patch('/kyc', req);
    },

    contact({ state }) {
        const convertedAmenities = state.additionalInfo.amenities
            ? state.additionalInfo.amenities.toString()
            : '';

        // prettier-ignore
        const req = {
            User: {
                UserName    : state.login.Username ? state.login.Username : state.contactForm.fullname, //  only for logged in user
                FullName    : state.contactForm.fullname,
                City        : state.locationDetails.locDetails ? state.locationDetails.locDetails.locName : '',
                EmailID     : state.contactForm.email,
                Mobile      : state.contactForm.cno,
            },
            Comments        : 'Spot Registered',
            RentDetails: {
                VehicleType         : '',
                Rate                : state.additionalInfo.rent ? state.additionalInfo.rent : '',
                MinBookingDuration  : state.additionalInfo.minDur ? state.additionalInfo.minDur : '',
                Availability        : '',
                SpecialService      : convertedAmenities, //  None/Camera/Security
                TnC                 : 'I Agree',
                Address             : state.locationDetails.locDetails ? state.locationDetails.locDetails.locName : state.contactForm.addr,

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

    async authenticateWithMaya({ state }) {
        try {
            await mayaClient.get('/auth/authenticate');
        } catch (err) {
            // todo write proper exception case
            throw new Error(err);
        }
    },

    async updateUserInfo({ commit, state }, userInfo) {
        try {
            commit('update-user-info', userInfo);
            await mayaClient.post('/auth/update-fields', state.userProfile);
        } catch (err) {
            // todo write proper exception case
            throw new Error(err);
        }
    },

    async updateVOParkingFacility({ commit, state }, parkingFacility) {
        try {
            // commit('update-user-info', userInfo);
            // await mayaClient.post('/auth/update-fields', state.userProfile);
        } catch (err) {
            // todo write proper exception case
            throw new Error(err);
        }
    },

    async updateSOParkingFacility({ commit, state }, parkingFacility) {
        try {
            // commit('update-user-info', userInfo);
            // await mayaClient.post('/auth/update-fields', state.userProfile);
        } catch (err) {
            // todo write proper exception case
            throw new Error(err);
        }
    },

    async getUserProfile({ commit, dispatch, state }) {
        try {
            commit('update-is-loading', true);
            await dispatch('authenticateWithMaya');
            const userProfile = await mayaClient.get('/auth/user');
            commit('update-user-profile', userProfile);
            commit('update-is-loading', false);
        } catch (err) {
            // todo write proper exception case
            throw new Error(err);
        }
    },

    updateSavedProfileFlag({ commit }, isSavedProfileData) {
        commit('update-is-saved-profile-data', isSavedProfileData);
    },

    updateUserProfileLatLng({ commit }, userLocation) {
        commit('set-user-lat-lng', userLocation);
    },
};

const unsub = onAuthStateChanged(auth, (user) => {
    store.commit('user/update-user', user);
    store.commit('user/update-auth-ready', true);
    unsub();
});

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
