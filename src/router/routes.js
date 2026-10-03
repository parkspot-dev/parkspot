import Home from '../views/PageHome.vue';
import PageAbout from '@/views/PageAbout.vue';
import { APP_LINK, MAYA_REQUEST_TIMEOUT_MS } from '../constant/constant';
import store from '@/store';

const AUTH_READY_TIMEOUT_MS = 5000;
// Role resolution rides on Maya after the token lands: `/auth/user`, then the
// `/auth/authenticate` fallback, each bounded by the Maya request timeout. The
// budget covers both plus slack, so a slow-but-working Maya still admits a
// real admin. Every step is bounded, so the bootstrap always settles; this
// timer is only a backstop.
const ROLE_READY_TIMEOUT_MS = 2 * MAYA_REQUEST_TIMEOUT_MS + 2000;

/**
 * Watches a `user`-module state flag until it turns truthy, or the timeout
 * expires. Shared by the two readiness waits below so neither duplicates the
 * unwatch/settle bookkeeping.
 *
 * @param {(state: object) => boolean} selector - reads the flag off the user state.
 * @param {number} timeoutMs - how long to wait before giving up.
 * @param {() => boolean} canWait - false skips the wait (SSR); see callers.
 * @return {Promise<boolean>} true if the flag became truthy, false on timeout.
 */
const waitForFlag = (selector, timeoutMs, canWait) => {
    if (selector(store.state.user)) {
        return Promise.resolve(true);
    }
    if (!canWait()) {
        return Promise.resolve(false);
    }

    return new Promise((resolve) => {
        let isSettled = false;
        // `store.watch` hands its getter the ROOT state, so step into the
        // `user` module before applying the selector.
        const unwatch = store.watch(
            (rootState) => selector(rootState.user),
            (isReady) => {
                if (!isReady || isSettled) {
                    return;
                }

                isSettled = true;
                clearTimeout(timeoutId);
                unwatch();
                resolve(true);
            },
        );

        const timeoutId = setTimeout(() => {
            if (isSettled) {
                return;
            }

            isSettled = true;
            unwatch();
            resolve(false);
        }, timeoutMs);
    });
};

const waitForAuthReady = (timeoutMs = AUTH_READY_TIMEOUT_MS) =>
    // SSR: there is no Firebase Auth listener on the server (see
    // `src/firebase.js`); waiting on `store.state.user.isAuthReady` would
    // deadlock until `timeoutMs` expired. Skip the wait so guards return
    // promptly during prerender.
    waitForFlag(
        (state) => state.isAuthReady,
        timeoutMs,
        () => typeof window !== 'undefined',
    );

/**
 * Waits until we know whether the signed-in user is an admin.
 *
 * `isAdmin` alone is ambiguous: `false` means either "asked Maya, answer is
 * no" or "never asked", and the guard cannot tell those apart. `isRoleResolved`
 * carries that distinction, so the guard gets a definitive answer instead of
 * bouncing a real admin whose profile is merely still in flight.
 */
const waitForRoleResolved = (timeoutMs = ROLE_READY_TIMEOUT_MS) =>
    waitForFlag(
        (state) => state.isRoleResolved,
        timeoutMs,
        () => typeof window !== 'undefined',
    );

// prettier-ignore
export const pages = {
    HOME                    : '/',
    FAQ                     : '/faq',
    ABOUT                   : '/about',
    FEATURES                : '/features',
    CONTACT                 : '/contact',
    SRP                     : '/srp',
    SPOT_DETAIL             : '/spot-details/:spotId',
    VOPORTAL                : '/get-parking-spot',
    SOPORTAL                : '/register-parking-spot',
    TERMS                   : '/terms-and-conditions',
    BLOG                    : '/blog',
    MAINBLOG                : '/blog/:id',
    SEARCH_PORTAL           : '/internal/search-portal',
    PAYMENTGATEWAY          : '/payment/:pathMatch(.*)*',
    NEARBY                  : '/bangalore/parking-near-:location',
    NEARBY_HYD              : '/hyderabad/parking-near-:location',
    TEMP                    : '/temp',
    THANK_YOU               : '/thank-you',
    ERROR                   : '/error',
    BOOKING_PORTAL          : "/internal/booking-portal",
    APP                     : "/app",
    PRIVACY                 : "/privacy",
    REGISTER_REQUEST        : "/internal/register-request",  
    PENDING_PAYMENTS        : "/internal/pending-payments",
    SPOT_REQUESTS           : "/internal/spot-requests",
    AUTOMATED_PARKING       : "/automated-parking",
    KYC_STATUS_PAGE         : "/internal/users/kyc-status",
    SPOTS_SEARCH            : "/internal/spot-search",
    MY_BOOKINGS              : "/profile/my-bookings"
};

export const routes = [
    {
        path: pages.HOME,
        name: 'Home',
        component: Home,
    },
    {
        path: '/user/edit-profile',
        name: 'editProfile',
        component: () => import('@/views/PageEditProfile.vue'),
    },
    {
        path: pages.FAQ,
        name: 'Faq',
        component: () => import('@/views/PageFaq.vue'),
    },

    {
        path: pages.ABOUT,
        name: 't-about',
        component: PageAbout,
    },
    {
        path: pages.FEATURES,
        name: 'features',
        component: () => import('@/views/PageFeature.vue'),
    },
    {
        path: pages.CONTACT,
        name: 'contactUs',
        component: () => import('@/views/PageContactUs'),
    },
    {
        path: pages.SRP,
        name: 'srp',
        component: () => import('@/views/PageSrp.vue'),
    },
    {
        path: pages.VOPORTAL,
        name: 'VOPortal',
        component: () => import('@/views/PageVOPortal.vue'),
    },
    {
        path: pages.SOPORTAL,
        name: 'SOPortal',
        component: () => import('@/views/PageSOPortal.vue'),
    },
    {
        path: '/terms-and-conditions',
        name: 'Terms',
        component: () => import('@/views/PageTerms.vue'),
    },
    {
        path: pages.PRIVACY,
        name: 'PrivacyPolicy',
        component: () => import('@/views/PagePrivacyPolicy.vue'),
    },
    {
        path: pages.BLOG,
        name: 'blog',
        component: () => import('@/views/PageBlogHome.vue'),
    },
    {
        path: pages.MAINBLOG,
        name: 'mainBlog',
        component: () => import('@/views/PageBlogPost.vue'),
    },
    {
        path: pages.SEARCH_PORTAL,
        name: 'SearchPortal',
        component: () => import('@/views/PageSearchPortal.vue'),
    },
    {
        path: pages.SPOT_REQUESTS,
        name: 'spotRequest',
        component: () => import('@/views/SpotRequest.vue'),
    },
    {
        path: pages.PAYMENTGATEWAY,
        name: 'paymentGateway',
        component: () => import('@/views/PagePaymentGateway.vue'),
    },
    // ! it will take " -mara/xyx"
    {
        path: pages.NEARBY,
        name: 'discover',
        component: () => import('@/views/PageNearBy.vue'),
    },
    {
        path: pages.NEARBY_HYD,
        name: 'discover-hyderabad',
        component: () => import('@/views/PageNearBy.vue'),
    },
    {
        path: pages.SPOT_DETAIL,
        name: 'spot-detail',
        component: () => import('@/views/PageSpotDetail.vue'),
    },
    {
        path: pages.THANK_YOU,
        name: 'thankYou',
        component: () => import('@/views/PageThankYou.vue'),
    },
    {
        path: pages.ERROR,
        name: 'error',
        component: () => import('@/views/PageError.vue'),
    },
    {
        path: pages.BOOKING_PORTAL,
        name: 'booking-portal',
        component: () => import('@/views/BookingPortal.vue'),
    },
    {
        path: pages.PENDING_PAYMENTS,
        name: 'pending-payments',
        component: () => import('@/views/PendingPaymentsPortal.vue'),
        beforeEnter: async (to, from, next) => {
            // SSR fast-path: `/internal/pending-payments` is filtered out
            // of `includedRoutes` and `crawl` is disabled (see
            // `vite.config.js`), so the renderer should never hit this
            // guard during prerender. The early return is defence in
            // depth — vue-router still mounts route guards eagerly and
            // any future code that exercises this route from the server
            // would otherwise see an unauthenticated stub world.
            if (typeof window === 'undefined') {
                next();
                return;
            }
            if (!store.state.user.isAuthReady) {
                const isReady = await waitForAuthReady();

                if (!isReady) {
                    next({ name: 'Home' });
                    return;
                }
            }

            const userState = store.state.user;
            const isLoggedIn = Boolean(userState.user);

            if (!isLoggedIn) {
                store.commit('user/update-login-modal', true);
                next({ name: 'Home', query: { redirect: to.fullPath } });
                return;
            }

            // `isAuthReady` now means "we have a token", not "profile loaded",
            // so the role can still be unresolved at this point. Wait for a
            // definitive answer, otherwise a legitimate admin who deep-links or
            // refreshes on a cold profile cache gets bounced to Home.
            if (!userState.isRoleResolved) {
                const isRoleResolved = await waitForRoleResolved();

                if (!isRoleResolved) {
                    next({ name: 'Home' });
                    return;
                }
            }

            if (!store.state.user.isAdmin) {
                next({ name: 'Home' });
                return;
            }

            next();
        },
    },
    {
        path: pages.REGISTER_REQUEST,
        name: 'vehicle-owner-registration',
        component: () => import('@/views/RegisterRequest.vue'),
    },
    {
        path: pages.AUTOMATED_PARKING,
        name: 'automated-parking',
        component: () => import('@/views/AutomateParking.vue'),
    },
    {
        path: pages.KYC_STATUS_PAGE,
        name: 'kyc-status',
        component: () => import('@/views/PageKYCStatus.vue'),
    },
    {
        path: pages.SPOTS_SEARCH,
        name: 'spot-search',
        component: () => import('@/views/PageSearchSpotByName.vue'),
    },
    {
        path: pages.MY_BOOKINGS,
        name: 'my-bookings',
        component: () => import('@/views/PageMyBookings.vue'),
    },
    {
        path: pages.APP,
        name: 'App',
        component: PageAbout,
        beforeEnter(to, from, next) {
            // SSR-safe: the OS-sniffing redirect can only run in the
            // browser. During prerender we just let vite-ssg emit the
            // (essentially empty) About-rendered HTML for `/app`; the
            // redirect kicks in on the very first client tick once the
            // SPA hydrates.
            if (typeof window === 'undefined') {
                next();
                return;
            }
            const androidRegexp = /android/i;
            if (androidRegexp.test(navigator.userAgent)) {
                window.location.href = APP_LINK.ANDROID;
            }
            const iOSRegexp = /iphone|ipad/i;
            if (iOSRegexp.test(navigator.userAgent)) {
                window.location.href = APP_LINK.IOS;
            }
            next();
        },
    },
    // BEGIN TEMPORARY REDIRECT - TO BE REMOVED IN THE FUTURE
    {
        path: '/search-portal',
        redirect: '/internal/search-portal',
        // This route is a temporary redirect to ensure that the old URL
        // continues to work.
    },
    // Todo Delete below code before deployment
    {
        path: pages.TEMP,
        name: 'temp',
        component: () => import('@/views/PageTemp.vue'),
    },
    {
        // path: "*",
        path: '/:catchAll(.*)',
        name: 'NotFound',
        meta: {
            requiresAuth: false,
        },
        component: Home,
        redirect: pages.HOME,
    },
];
