import Home from '../views/PageHome.vue';
import PageAbout from '@/views/PageAbout.vue';
import { APP_LINK } from '../constant/constant';

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
    SEARCH_PORTAL           : '/search-portal',
    PAYMENTGATEWAY          : '/payment/*',
    NEARBY                  : '/bangalore/parking-near-*',
    NEARBY_HYD              : '/hyderabad/parking-near-*',
    TEMP                    : '/temp',
    THANK_YOU               : '/thank-you',
    ERROR                   : '/error',
    BOOKING_PORTAL          : "/internal/booking-portal",
    APP                     : "/app",
    PRIVACY                 : "/privacy-policy",
    PRIVACY_V2              : "/privacy"
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
        path: pages.PRIVACY_V2,
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
        path: pages.APP,
        name: 'App',
        component: PageAbout,
        beforeEnter(to, from, next) {
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
    // Todo Delete below code before deployment
    {
        path: pages.TEMP,
        name: 'temp',
        component: () => import('@/views/PageTemp.vue'),
    },
    {
        path: '*',
        component: Home,
        redirect: pages.HOME,
    },
];
