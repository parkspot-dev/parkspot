// Helpers for the visual-regression test suite.
//
// Two design decisions worth knowing about:
//
//  1. We DO NOT import the real Vuex store (src/store/index.js) because
//     two of its modules (user, config) eagerly initialize Firebase --
//     loading them under headless Chromium triggers network calls and
//     auth listeners that make screenshots flaky. Instead we register
//     all module names with empty namespaced state so that mapState /
//     mapGetters calls return undefined cleanly, which most templates
//     handle (they just render skeletons / placeholders).
//
//  2. The default global config aggressively stubs Buefy components
//     with a transparent <div><slot/></div>. Buefy's real components
//     work fine in headless mode but they pull in a *lot* of styles
//     that obscure the parent layout we actually want to regression
//     test. If a hand-crafted spec needs the real thing, pass
//     `{ buefy: true }` to renderOptions().

import { createMemoryHistory, createRouter } from 'vue-router';
import { createStore } from 'vuex';

// Module names lifted verbatim from src/store/index.js. Keep in sync
// when a new Vuex module is added to the app.
const STORE_MODULE_NAMES = [
    'device', 'blog', 'user', 'map', 'sdp', 'searchPortal',
    'bookingPortal', 'config', 'registerRequest', 'spotRequests',
    'reviewSpot', 'kycStatusPortal', 'myBookings', 'app',
    'seoPages', 'pendingPayments',
];

function makeFakeStore(overrides = {}) {
    const modules = {};
    for (const name of STORE_MODULE_NAMES) {
        modules[name] = {
            namespaced: true,
            state: overrides[name]?.state || {},
            mutations: overrides[name]?.mutations || {},
            actions: new Proxy({}, { get: () => () => Promise.resolve() }),
            getters: new Proxy({}, { get: () => () => undefined }),
        };
    }
    return createStore({ modules });
}

function makeFakeRouter(initialPath = '/') {
   const router = createRouter({
       history: createMemoryHistory(),
       routes: [
           { path: '/', name: 'Home', component: { template: '<div/>' } },
           { path: '/login', name: 'Login', component: { template: '<div/>' } },
           { path: '/error', name: 'error', component: { template: '<div/>' } },
           // Catch-all by path. Any unknown name is rerouted to '/'
           // by the resolve() patch below so screenshots don't fail
           // on missing-route errors from navbar / footer links.
           { path: '/:catchAll(.*)*',
             name: 'visual-test-catchall',
             component: { template: '<div/>' } },
       ],
   });
   // vue-router throws when <router-link :to="{ name: 'X' }"> targets
   // a name we haven't registered. For visual tests we only care that
   // the link RENDERS, not where it goes -- silently fall back to '/'
   // so blind-mounted nav chrome doesn't blow up the suite.
   const originalResolve = router.resolve.bind(router);
   router.resolve = (to, ...rest) => {
       try {
           return originalResolve(to, ...rest);
       } catch (err) {
           if (err && typeof err.message === 'string' && err.message.includes('No match for')) {
               return originalResolve('/', ...rest);
           }
           throw err;
       }
   };
   router.push(initialPath);
   return router;
}


// Buefy components we replace with transparent slot wrappers when the
// caller does NOT opt into real Buefy. Listing them explicitly is
// safer than `'b-': true` glob stubbing (Vue Test Utils does not
// support glob stubs in browser mode).
const BUEFY_STUBS = {
    'b-breadcrumb': { template: '<nav class="breadcrumb"><slot/></nav>' },
    'b-breadcrumb-item': { template: '<span><slot/></span>' },
    'b-tabs': { template: '<div><slot/></div>' },
    'b-tab-item': { template: '<div><slot/></div>' },
    'b-modal': { template: '<div><slot/></div>' },
    'b-loading': { template: '<div/>' },
    'b-tooltip': { template: '<span><slot/></span>' },
    'b-collapse': { template: '<div><slot/></div>' },
    'b-icon': { template: '<i/>' },
    'b-input': { template: '<input/>' },
    'b-field': { template: '<div><slot/></div>' },
    'b-select': { template: '<select><slot/></select>' },
    'b-checkbox': { template: '<input type="checkbox"/>' },
    'b-radio': { template: '<input type="radio"/>' },
    'b-switch': { template: '<input type="checkbox"/>' },
    'b-table': { template: '<table><slot/></table>' },
    'b-numberinput': { template: '<input type="number"/>' },
    'b-datepicker': { template: '<input type="date"/>' },
    'b-autocomplete': { template: '<input/>' },
    'b-dropdown': { template: '<div><slot/></div>' },
    'b-dropdown-item': { template: '<div><slot/></div>' },
    'b-pagination': { template: '<nav><slot/></nav>' },
    'b-message': { template: '<div><slot/></div>' },
    'b-progress': { template: '<progress/>' },
    'b-skeleton': { template: '<div class="skeleton"/>' },
    'b-tag': { template: '<span class="tag"><slot/></span>' },
    'b-taglist': { template: '<div><slot/></div>' },
    'b-image': { template: '<img/>' },
    'b-carousel': { template: '<div><slot/></div>' },
    'b-carousel-item': { template: '<div><slot/></div>' },
    'b-steps': { template: '<div><slot/></div>' },
    'b-step-item': { template: '<div><slot/></div>' },
    'b-slider': { template: '<input type="range"/>' },
    'b-rate': { template: '<div/>' },
    'b-upload': { template: '<div><slot/></div>' },
    'b-notification': { template: '<div><slot/></div>' },
};

/**
 * Build the `global` config block for vitest-browser-vue's render().
 *
 * @param {object} [opts]
 * @param {object} [opts.storeState] - per-module overrides (e.g. { sdp: { state: {...} } })
 * @param {string} [opts.path] - initial router path
 * @param {object} [opts.stubs] - extra stubs (or { 'ChildName': false } to opt out)
 * @param {boolean} [opts.buefy] - when true, do NOT stub b-* components
 */
export function renderOptions(opts = {}) {
    const stubs = opts.buefy
        ? { ...(opts.stubs || {}) }
        : { ...BUEFY_STUBS, ...(opts.stubs || {}) };

    return {
        global: {
            plugins: [
                makeFakeStore(opts.storeState || {}),
                makeFakeRouter(opts.path || '/'),
            ],
            stubs,
            mocks: {
                $buefy: {
                    toast: { open: () => {} },
                    dialog: { confirm: () => {}, alert: () => {} },
                    snackbar: { open: () => {} },
                    notification: { open: () => {} },
                },
            },
            // Silence "[Vue warn]: Failed to resolve component: X" noise
            // from blind-mounted templates that reference siblings we
            // didn't pre-import. The visual diff is still meaningful.
            config: { warnHandler: () => {} },
        },
        attrs: { 'data-visual-root': '' },
    };
}

/**
 * Wait for at least one rAF + a microtask so reactive watchers /
 * defineAsyncComponent / Vuex actions have a chance to settle before
 * we screenshot. 50ms is empirically enough for every component that
 * does not perform a real network call.
 */
export function tick(ms = 50) {
    return new Promise((resolve) => {
        if (typeof requestAnimationFrame === 'function') {
            requestAnimationFrame(() => setTimeout(resolve, ms));
        } else {
            setTimeout(resolve, ms);
        }
    });
}
