import { mayaClient } from '@/services/api';
import { auth } from '../../firebase';
import store from '../../store';
import { UserType } from '@/constant/enums';
import {
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth';

const state = {
    user: null,
    userProfile: {
        FullName: '',
        EmailID: '',
        Mobile: '',
        Type: 'VO',
    },
    isAdmin: false,
    isAgent: false,
    isAuthReady: false,
    loginModal: false,
    contactForm: {},
    kycForm: {},
    additionalInfo: {},
    login: {},
    locationDetails: {},
    preference: {},
};

const getters = {};

const mutations = {
    'update-user'(state, user) {
        state.user = user;
        if (user) {
            localStorage.setItem('PSAuthKey', user.accessToken);
        } else {
            localStorage.setItem('PSAuthKey', null);
            localStorage.removeItem('UserProfile');
            state.isAdmin = false;
            state.isAgent = false;
        }
    },

    'update-user-profile'(state, userProfile) {
        userProfile['UserName'] = '';
        state.userProfile = userProfile;
        if (
            userProfile &&
            !Object.prototype.hasOwnProperty.call(userProfile, 'ErrorCode')
        ) {
            localStorage.setItem('UserProfile', JSON.stringify(userProfile));
        }
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
    'set-user-type'(state, userType) {
        state.isAdmin = userType == UserType.Admin;
        state.isAgent = userType == UserType.Agent || state.isAdmin;
    },
    'update-images'(state, images = {}) {
        state.contactForm.images = images;
    },
    'reset-user-profile'(state) {
        state.userProfile = {
            FullName: '',
            EmailID: '',
            Mobile: '',
            Type: 'VO',
        };
    },
};

const actions = {
    async loginWithGoogle({ commit, dispatch }) {
        const gProvider = new GoogleAuthProvider();

        try {
            const res = await signInWithPopup(auth, gProvider);
            const user = res.user;
            commit('update-user', user);
            commit('update-login-Modal', false);
            dispatch('authenticateWithMaya');
        } catch (error) {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.log(errorCode, errorMessage, email, credential);
        }
    },

    async logOut({ commit, state }) {
        try {
            await signOut(auth);
            commit('update-user', null);
            commit('reset-user-profile');
        } catch (err) {
            // todo write proper exception case
            throw new Error(err);
        }
    },

    register({ commit, state }) {
        // prettier-ignore
        const req = {
            UserName: 'dummy_' + state.contactForm.fullname + '_' + Date.now(),
            Password: 'dummy@123',
            FullName: state.contactForm.fullname,
            City: state.locationDetails.locDetails.locName,
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
        // prettier-ignore
        const req = {
            ContactNo: state.contactForm.cno,
            UserName: state.login.Username,
            Owner: state.kycForm.owner,
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
        const convertedAmenities = state.additionalInfo.amenities
            ? state.additionalInfo.amenities.toString()
            : '';

        // prettier-ignore
        const req = {
            User: {
                UserName: state.login.Username ? state.login.Username : state.contactForm.fullname, //  only for logged in user
                FullName: state.contactForm.fullname,
                City: state.locationDetails.locDetails ? state.locationDetails.locDetails.locName : '',
                EmailID: state.contactForm.email,
                Mobile: state.contactForm.cno,
            },
            Comments: 'Spot Registered',
            RentDetails: {
                VehicleType: '',
                Rate: state.additionalInfo.rent ? state.additionalInfo.rent : '',
                MinBookingDuration: state.additionalInfo.minDur ? state.additionalInfo.minDur : '',
                Availability: '',
                SpecialService: convertedAmenities, //  None/Camera/Security
                TnC: 'I Agree',
                Address: state.locationDetails.locDetails ? state.locationDetails.locDetails.locName : state.contactForm.addr,

            },
        };

        mayaClient.post('/contact', req);
    },

    onlyContact({ state }) {
        const comments =
            'From the Home Page ----->' +
            state.contactForm.msg +
            ' Car Model: ' +
            state.contactForm.carModel;
        // prettier-ignore
        const req = {
            User: {
                FullName: state.contactForm.fullname,
                EmailID: state.contactForm.email,
                Mobile: state.contactForm.cno,
            },
            Comments: comments,
            CarModel: state.contactForm.carModel ? state.contactForm.carModel : '',
        };

        mayaClient.post('/contact', req);
    },

    async registerSpot({ state }) {
        const req = {
            FullName: state.contactForm.fullname,
            ApartmentName: state.contactForm.ApartmentName,
            MonthlyRent: state.contactForm.expectedRent,
            Mobile: state.contactForm.cno,
            Address: state.contactForm.address,
            ParkingSize: state.contactForm.parkingSize, // "Hatchback","Compact SUV", "SUV"
            ServicesAvailable: state.contactForm.facilities, // "CCTV", "Security Gaurd", "Covered", "24Hrs Access", "Parking Stickers"
            BookingDuration: '', // "Monthly", "Weekly", "Daily"
            Remark: '',
            MapLink: state.contactForm.mapLink,
            SpotImages: state.contactForm.images,
            SiteType: state.contactForm.siteType,
            City: state.contactForm.city,
        };

        await mayaClient.post('/owner/spot-request', req);
    },

    async requestSpot({ state }) {
        // prettier-ignore
        const req = {
            Name: state.contactForm.fullname,
            Mobile: state.contactForm.cno,
            EmailID: state.contactForm.email,
            CarModel: state.preference.carModel,
            Duration: state.preference.minDur,
            // Country     : state.locationDetails.locDetails.country,
            // State       : state.locationDetails.locDetails.state,
            // City        : state.locationDetails.locDetails.city,
            // Latitude    : state.locationDetails.lnglat.lat,
            // Longitude   : state.locationDetails.lnglat.lng,
            // Landmark    : state.locationDetails.locDetails.city.country,
        };

        mayaClient.post('/owner/parking-request', req);
    },

    async authenticateWithMaya({ commit }) {
        try {
            const res = await mayaClient.get('/auth/authenticate');

            if (res?.UserType) {
                commit('set-user-type', res.UserType);
            }
        } catch (err) {
            // todo write proper exception case
            throw new Error(err);
        }
    },

    async updateUserInfo({ commit, state }) {
        try {
            await mayaClient.post('/auth/update-fields', state.userProfile);
        } catch (err) {
            // todo write proper exception case
            throw new Error(err);
        }
    },

    updateImages({ commit }, images) {
        commit('update-images', images);
    },

    async getUserProfile({ commit, dispatch }) {
        try {
            const userProfile = await mayaClient.get('/auth/user');

            commit('update-user-profile', userProfile);

            if (userProfile?.Type) {
                commit('set-user-type', userProfile.Type);
            } else {
                // fallback in case Type missing
                await dispatch('authenticateWithMaya');
            }
        } catch {
            // fallback if profile API fails
            await dispatch('authenticateWithMaya');
        }
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
