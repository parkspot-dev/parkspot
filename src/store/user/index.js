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
import { identify, setUserProperty } from '@/lib/analytics';
import { formatRemarkWithUtm } from '@/lib/analytics/attribution';
import { logger } from '@/utils/logger';
import { withTimeout } from '@/utils/with-timeout';

// Bound for `getIdToken()`, which touches the network on refresh and would
// otherwise be able to block auth bootstrap indefinitely.
const ID_TOKEN_TIMEOUT_MS = 5000;

const PS_AUTH_KEY = 'PSAuthKey';
const USER_PROFILE_STORAGE_KEY = 'UserProfile';
const PROFILE_CACHE_PREFIX = 'profile:';
const PROFILE_CACHE_VERSION = 1;
const PROFILE_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const getPsAuthKey = () => {
    const key = localStorage.getItem(PS_AUTH_KEY);
    if (
        !key ||
        !key.trim() ||
        key.trim().toLowerCase() === 'undefined' ||
        key.trim().toLowerCase() === 'null'
    ) {
        logger.warn(
            '[PSAuthKey Error] Receiver check: PSAuthKey is empty or invalid in localStorage',
        );
    }
    return key;
};

const hasValidPsAuthKey = () => {
    const key = getPsAuthKey();
    const isValid = Boolean(
        key &&
            key.trim() &&
            key.trim().toLowerCase() !== 'undefined' &&
            key.trim().toLowerCase() !== 'null',
    );
    if (!isValid) {
        logger.warn(
            '[PSAuthKey Error] Receiver validation failed: PSAuthKey is empty/invalid',
        );
    }
    return isValid;
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

const resolveProfileCacheUserId = (
    primaryUser,
    fallbackUser = auth.currentUser,
) => resolveUserIdentity(primaryUser) || resolveUserIdentity(fallbackUser);

const state = () => ({
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
    // Whether we know this user's role yet. `isAdmin` alone cannot express
    // "asked Maya, answer is no" vs "never asked", and the pending-payments
    // route guard must be able to tell those apart — see `update-auth-progress`.
    isRoleResolved: false,
    loginModal: false,
    contactForm: {},
    kycForm: {},
    additionalInfo: {},
    login: {},
    locationDetails: {},
    preference: {},
    authError: null,
});

const getters = {};

const mutations = {
    'update-user'(state, user) {
        state.user = user;
        if (!user) {
            localStorage.removeItem(PS_AUTH_KEY);
            localStorage.removeItem(USER_PROFILE_STORAGE_KEY);
            state.isAdmin = false;
            state.isAgent = false;
            // A signed-out user has no role, so the previous user's resolved
            // role must not be trusted for whoever signs in next.
            state.isRoleResolved = false;
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

    /**
     * Single writer for BOTH readiness flags.
     *
     * `isAuthReady` and `isRoleResolved` are a lifecycle, not two
     * independent booleans: a resolved role implies auth is ready. Keeping
     * them in one mutation makes it impossible for a caller to advance one
     * without the other, and the implication is asserted here rather than
     * trusted to call order in `handleAuthStateChanged`.
     *
     * The `authReady || roleResolved` is deliberate — it NORMALISES a
     * nonsensical `{ authReady: false, roleResolved: true }` into a valid
     * state instead of letting the two flags contradict each other.
     */
    'update-auth-progress'(state, { authReady, roleResolved } = {}) {
        state.isAuthReady = authReady || roleResolved;
        // Coerced so a partial commit (`{ authReady: true }`) still leaves a
        // real boolean behind rather than `undefined`.
        state.isRoleResolved = Boolean(roleResolved);
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

        // Resolves rather than rethrows. A Google sign-in failure is an
        // expected outcome of an unauthenticated action, not an exception: the
        // caller (OrganismLogin) is the only thing that can render the right
        // message for it. Swallowing it here means every caller previously had
        // to invent its own error handling, and the one that did not simply
        // left the user staring at an inert button.
        try {
            const res = await signInWithPopup(auth, gProvider);
            const user = res.user;
            const token = await withTimeout(
                user.getIdToken(),
                ID_TOKEN_TIMEOUT_MS,
            );
            if (!token || !token.trim()) {
                logger.error(
                    new Error(
                        '[PSAuthKey Error] Google Sign-In succeeded but received empty PSAuthKey',
                    ),
                );
                return { ok: false, code: null };
            }
            localStorage.setItem(PS_AUTH_KEY, token);
            commit('update-user', user);
            commit('update-login-modal', false);
            await dispatch('authenticateWithMaya');
            return { ok: true };
        } catch (error) {
            logger.error(error);
            return { ok: false, code: error?.code || null };
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
            Comments: formatRemarkWithUtm('Spot Registered'),
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
            Comments: formatRemarkWithUtm(comments),
            CarModel: state.contactForm.carModel ? state.contactForm.carModel : '',
        };

        await mayaClient.post('/contact', req);
    },

    async registerSpot({ state }) {
        const userRemark =
            state.contactForm.remark || state.contactForm.Remark || '';
        const remarkWithUtm = formatRemarkWithUtm(userRemark);
        const req = {
            FullName: state.contactForm.fullname,
            ApartmentName: state.contactForm.ApartmentName,
            MonthlyRent: state.contactForm.expectedRent,
            Mobile: state.contactForm.cno,
            Address: state.contactForm.address,
            ParkingSize: state.contactForm.parkingSize, // "Hatchback","Compact SUV", "SUV"
            ServicesAvailable: state.contactForm.facilities, // "CCTV", "Security Gaurd", "Covered", "24Hrs Access", "Parking Stickers"
            BookingDuration: '', // "Monthly", "Weekly", "Daily"
            Comments: remarkWithUtm,
            Remark: remarkWithUtm,
            MapLink: state.contactForm.mapLink,
            SpotImages: state.contactForm.images,
            SiteType: state.contactForm.siteType,
            City: state.contactForm.city,
        };

        await mayaClient.post('/owner/spot-request', req);
    },

    async requestSpot({ state }) {
        const userRemark =
            state.contactForm.remark ||
            state.contactForm.Remark ||
            state.preference.remark ||
            '';
        const remarkWithUtm = formatRemarkWithUtm(userRemark);

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
            Comments: remarkWithUtm,
            Remark: remarkWithUtm,
        };

        await mayaClient.post('/owner/parking-request', req);
    },

    async authenticateWithMaya({ commit }) {
        if (!hasValidPsAuthKey()) {
            commit('set-auth-error', {
                source: 'authenticateWithMaya',
                message: 'Missing PS auth key',
            });
            return;
        }

        commit('set-auth-error', null);

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
            commit('set-auth-error', {
                source: 'getUserProfile',
                message: 'Missing PS auth key',
            });
            return;
        }

        commit('set-auth-error', null);

        const cacheUserId = resolveProfileCacheUserId(state?.user);
        const cachedProfile = readProfileCache(cacheUserId);

        if (cachedProfile?.Type) {
            commit('update-user-profile', cachedProfile);
            commit('set-user-type', cachedProfile.Type);
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

// Loads the signed-in user's profile and analytics identity. Runs in the
// BACKGROUND (see `handleAuthStateChanged`) so a slow or hung Maya call can
// never gate the navbar. Kept as a separate function so the awaited chain is
// easy to reason about and to test.
//
// `/auth/user/agents` is deliberately NOT fetched here: it is an internal CRM
// endpoint that 401/403s for regular customers, which surfaced as a "session
// expired" alert right after a successful login. The search/booking portals
// fetch agents on their own mount.
async function bootstrapUserData(user) {
    try {
        await store.dispatch('user/getUserProfile');

        // GA4 user identity. `user.uid` is Firebase's internal ID (not
        // PII); role comes from the resolved profile. `city` is
        // intentionally omitted — the app has no reliable home-city
        // source (locName is a searched location, not the user's city).
        const currentUser = store.state?.user;
        const userRole = currentUser?.isAdmin
            ? 'admin'
            : currentUser?.isAgent
              ? 'agent'
              : currentUser?.userProfile?.Type || 'unknown';
        identify(user.uid, {
            is_authenticated: true,
            user_role: userRole,
        });
    } finally {
        // In a `finally` so a throwing `identify()` cannot strand the
        // `pending-payments` route guard waiting on role resolution (see
        // `waitForRoleResolved`). Reaching here means we have asked Maya and
        // the role is settled one way or the other — including "definitely
        // not an admin", which is the answer that lets the guard bail out
        // immediately instead of burning its full timeout.
        store.commit('user/update-auth-progress', {
            authReady: true,
            roleResolved: true,
        });
    }
}

// Firebase auth-state handler. Exported (not just registered) so it can be
// unit-tested directly instead of through a module-level subscription.
//
// Key resilience property: the navbar only needs to know WHETHER a user is
// signed in, not whether their profile has finished loading. So once we have
// a valid token we flip `isAuthReady` immediately and hydrate the profile in
// the background. Previously the flag flipped only after `getUserProfile` had
// completed, so a slow/hung Maya call kept the profile picture and CRM menu
// from ever appearing — the reported "stuck" symptom.
//
// `isRoleResolved` is the second half of that split: `isAuthReady` alone says
// nothing about whether `isAdmin` can be trusted yet, so route guards that gate
// on role wait for this one instead. Both are written only through
// `update-auth-progress`, which is why they cannot drift apart.
export async function handleAuthStateChanged(user) {
    // Firebase does not attach a `.catch` to this callback, so any
    // throw here becomes an unhandled rejection. Guard the whole body
    // (not just the Maya calls) so a stale `store` binding — e.g. under
    // module teardown in tests — can't escape as one.
    try {
        const previousUser = store?.state?.user?.user;
        const previousCacheUserId = resolveUserIdentity(previousUser);

        store.commit('user/update-user', user);

        if (!user) {
            store.commit('user/set-auth-error', null);
            clearProfileCache(previousCacheUserId);
            localStorage.removeItem(PS_AUTH_KEY);
            // Clear the GA4 user-scoped identity on sign-out. No user_id and
            // no PII — just flips the authenticated flag off.
            setUserProperty('is_authenticated', false);
            // Signed out: auth has settled, and there is definitively no role
            // for this session — the guard must not sit waiting on one.
            store.commit('user/update-auth-progress', {
                authReady: true,
                roleResolved: false,
            });
            return;
        }

        let token = '';
        try {
            // Bounded so a stalled token refresh cannot hang bootstrap forever.
            token = await withTimeout(user.getIdToken(), ID_TOKEN_TIMEOUT_MS);
        } catch {
            token = '';
        }

        if (!token || !token.trim()) {
            logger.warn(
                '[PSAuthKey Error] Firebase Auth state changed but received empty PSAuthKey',
            );
            store.commit('user/set-auth-error', {
                source: 'onAuthStateChanged',
                message: 'Received empty PSAuthKey from Firebase',
            });
            store.commit('user/update-auth-progress', {
                authReady: true,
                roleResolved: false,
            });
            return;
        }

        localStorage.setItem(PS_AUTH_KEY, token);

        // Unblock the UI now; hydrate the rest in the background. The role is
        // still unresolved at this point, which is why `bootstrapUserData`
        // commits `roleResolved: true` when it settles.
        store.commit('user/update-auth-progress', {
            authReady: true,
            roleResolved: false,
        });

        bootstrapUserData(user).catch(() => {
            store.commit('user/set-auth-error', {
                source: 'onAuthStateChanged',
                message: 'Failed to load user bootstrap data',
            });
        });
    } catch (err) {
        console.error('onAuthStateChanged listener failed', err);
    }
}

// Firebase Auth's `onAuthStateChanged` + `localStorage` are browser-only.
// Under SSR (vite-ssg) we must not run any of this — both because `auth` is
// a stub on the server (see `src/firebase.js`) and because mutating a
// module-level subscription would leak state across renders.
if (typeof window !== 'undefined') {
    onAuthStateChanged(auth, handleAuthStateChanged);
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
