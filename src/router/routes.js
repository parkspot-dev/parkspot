import Home from '../views/PageHome.vue';
import PageAbout from '@/views/PageAbout.vue';
import { firebase, getDatabase, ref, get, child } from '../firebase';

const guardThisRoute = async (to, from, next) => {
    const db = getDatabase(firebase);
    const dbref = ref(db);
    const res = await get(child(dbref, `portal-user`));
    const credentials = await res.val();
    let userNameLocal = localStorage.getItem('searchPortalUser');
    let userNamePwdLocal = localStorage.getItem('searchPortalUserPwd');
    if (
        userNameLocal === credentials.userName &&
        userNamePwdLocal === credentials.password
    ) {
        next();
    } else {
        alert('Invalid username/password');
        userNameLocal = prompt('Enter User Name:');
        userNamePwdLocal = prompt('Enter Password:');
        localStorage.setItem('searchPortalUser', userNameLocal);
        localStorage.setItem('searchPortalUserPwd', userNamePwdLocal);
        next('/search-portal');
    }
};

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
    TEMP                    : '/temp',
    THANK_YOU               : '/thank-you',
    ERROR                   : '/error',
};

export const routes = [
    {
        path: pages.HOME,
        name: 'Home',
        component: Home,
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
        beforeEnter: guardThisRoute,
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
        path: pages.SPOT_DETAIL,
        name: 'spot-detail',
        component: () => import('@/views/PageSpotDetail.vue'),
        children: [
            {
                // when /spot-details/:id/internal is matched
                path: 'admin',
                name: 'adminOnly-spot-detail',
                component: () => import('@/views/PageSpotDetail.vue'),
                beforeEnter: guardThisRoute,
            },
        ],
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
