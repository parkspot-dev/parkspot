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

const PS_AUTH_KEY = 'PSAuthKey';
const USER_PROFILE_STORAGE_KEY = 'UserProfile';
const PROFILE_CACHE_PREFIX = 'profile:';
const PROFILE_CACHE_VERSION = 1;
const PROFILE_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const getPsAuthKey = () => localStorage.getItem(PS_AUTH_KEY);

const hasValidPsAuthKey = () => {
    const key = getPsAuthKey();
    return Boolean(
        key &&
            key.trim() &&
            key.trim().toLowerCase() !== 'undefined' &&
            key.trim().toLowerCase() !== 'null',
    );
};

const normalizeCacheIdentity = (value) =>
    String(value || '')
        .trim()
        .toLowerCase();

const resolveUserIdentity = (user = {}) =>
    normalizeCacheIdentity(
        user?.uid || user?.UserName || user?.EmailID || user?.email,
    );

const getProfileCacheKey = (userId) => {
    const identity = normalizeCacheIdentity(userId);
    return identity ? `${PROFILE_CACHE_PREFIX}${identity}` : '';
};

const clearProfileCache = (userId) => {
    const cacheKey = getProfileCacheKey(userId);
    if (!cacheKey) {
        return;
    }
    localStorage.removeItem(cacheKey);
};

const readProfileCache = (userId) => {
    const cacheKey = getProfileCacheKey(userId);
    if (!cacheKey) {
        return null;
    }

    const rawCache = localStorage.getItem(cacheKey);
    if (!rawCache) {
        return null;
    }

    try {
        const parsedCache = JSON.parse(rawCache);
        const cacheVersion = Number(parsedCache?.version || 0);
        const savedAt = Number(parsedCache?.savedAt || 0);

        if (
            cacheVersion !== PROFILE_CACHE_VERSION ||
            !Number.isFinite(savedAt) ||
            Date.now() - savedAt > PROFILE_CACHE_TTL_MS ||
            !parsedCache?.data ||
            typeof parsedCache.data !== 'object'
        ) {
            clearProfileCache(userId);
            return null;
        }

        return parsedCache.data;
    } catch {
        clearProfileCache(userId);
        return null;
    }
};

const writeProfileCache = (userId, userProfile) => {
    const cacheKey = getProfileCacheKey(userId);
    if (!cacheKey || !userProfile || typeof userProfile !== 'object') {
        return;
    }

    const payload = {
        version: PROFILE_CACHE_VERSION,
        savedAt: Date.now(),
        data: userProfile,
    };

    try {
        localStorage.setItem(cacheKey, JSON.stringify(payload));
    } catch {
        clearProfileCache(userId);
    }
};

const resolveProfileCacheUserId = (stateUser, authUser = auth.currentUser) =>
    resolveUserIdentity(stateUser) || resolveUserIdentity(authUser);

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
    authError: null,
};

const getters = {};

const mutations = {
    'update-user'(state, user) {
        state.user = user;
        if (!user) {
            localStorage.removeItem(PS_AUTH_KEY);
            localStorage.removeItem(USER_PROFILE_STORAGE_KEY);
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
            localStorage.setItem(
                USER_PROFILE_STORAGE_KEY,
                JSON.stringify(userProfile),
            );
        }
    },

    'update-login-modal'(state, loginModal) {
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
        state.login = { ...loginData };
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
    'set-auth-error'(state, error) {
        state.authError = error;
    },
};

const actions = {
    async loginWithGoogle({ commit, dispatch }) {
        const gProvider = new GoogleAuthProvider();

        try {
            const res = await signInWithPopup(auth, gProvider);
            const user = res.user;
            const token = await user.getIdToken();
            localStorage.setItem(PS_AUTH_KEY, token);
            commit('update-user', user);
            commit('update-login-modal', false);
            await dispatch('authenticateWithMaya');
            await dispatch('app/getAgents', null, { root: true });
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

    async logOut({ commit, dispatch, state }) {
        const cacheUserId = resolveProfileCacheUserId(state?.user);
        try {
            await signOut(auth);
            clearProfileCache(cacheUserId);
            await dispatch('app/clearAgents', null, { root: true });
            commit('update-user', null);
            commit('reset-user-profile');
        } catch (err) {
            // todo write proper exception case
            throw new Error(err?.message || 'Something went wrong');
        }
    },

    async register({ commit, state }) {
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
        await mayaClient.post('/auth/register', req);
    },

    async login({ state }) {
        await mayaClient.post('/auth/login', state.login);
    },

    async kyc({ state }) {
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

        await mayaClient.patch('/kyc', req);
    },

    async contact({ state }) {
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

        await mayaClient.post('/contact', req);
    },

    async onlyContact({ state }) {
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

        await mayaClient.post('/contact', req);
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

        await mayaClient.post('/owner/parking-request', req);
    },

    async authenticateWithMaya({ commit }) {
        if (!hasValidPsAuthKey()) {
            return;
        }

        try {
            const res = await mayaClient.get('/auth/authenticate');

            if (res?.UserType) {
                commit('set-user-type', res.UserType);
            }
        } catch (err) {
            // todo write proper exception case
            throw new Error(err?.message || 'Something went wrong');
        }
    },

    async updateUserInfo({ commit, state }) {
        try {
            await mayaClient.post('/auth/update-fields', state.userProfile);
        } catch (err) {
            const data = err?.response?.data;
            const errorMessage =
                data?.DisplayMsg ||
                data?.message ||
                data?.Message ||
                data?.error ||
                data?.Error ||
                (typeof data === 'string' ? data : '') ||
                err?.message ||
                'Something went wrong';

            throw new Error(errorMessage);
        }
    },

    updateImages({ commit }, images) {
        commit('update-images', images);
    },

    async getUserProfile({ commit, dispatch, state }) {
        if (!hasValidPsAuthKey()) {
            return;
        }

        const cacheUserId = resolveProfileCacheUserId(state?.user);
        const cachedProfile = readProfileCache(cacheUserId);

        if (cachedProfile) {
            commit('update-user-profile', cachedProfile);

            if (cachedProfile?.Type) {
                commit('set-user-type', cachedProfile.Type);
            }

            return;
        }

        try {
            const userProfile = await mayaClient.get('/auth/user');

            commit('update-user-profile', userProfile);

            if (userProfile?.Type) {
                writeProfileCache(cacheUserId, userProfile);
                commit('set-user-type', userProfile.Type);
            } else {
                await dispatch('authenticateWithMaya');
            }
        } catch {
            // fallback if profile API fails
            await dispatch('authenticateWithMaya');
        }
    },
};

const unsub = onAuthStateChanged(auth, async (user) => {
    const previousUser = store.state?.user?.user;
    const previousCacheUserId = resolveProfileCacheUserId(
        previousUser,
        previousUser,
    );

    store.commit('user/update-user', user);
    store.commit('user/update-auth-ready', true);

    if (!user) {
        clearProfileCache(previousCacheUserId);
        localStorage.removeItem(PS_AUTH_KEY);
        return;
    }

    const token = await user.getIdToken();
    localStorage.setItem(PS_AUTH_KEY, token);

    try {
        await store.dispatch('user/getUserProfile');
        await store.dispatch('app/getAgents');
    } catch {
        store.commit('user/set-auth-error', {
            source: 'onAuthStateChanged',
            message: 'Failed to load user bootstrap data',
        });
    }

    unsub();
});

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
