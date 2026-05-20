// Store entry. Exposes `createAppStore()` so `vite-ssg` can build a fresh
// Vuex store per render (preventing cross-route state pollution under SSR),
// plus a lazy `default` singleton so legacy callers that historically did
// `import store from '@/store'; store.dispatch(...)` keep working unchanged.
//
// The default export is a Proxy that constructs the store on first access,
// and only on the client. Server-side access throws by design — every code
// path the SSR pass touches must go through the per-render store from
// `createAppStore()`.

import { createStore } from 'vuex';

import app from './app';
import blog from './blog';
import bookingPortal from './bookingPortal';
import config from './config';
import device from './device';
import kycStatusPortal from './kycStatusPortal';
import map from './map';
import myBookings from './myBookings';
import pendingPayments from './pendingPayments';
import registerRequest from './registerRequest';
import reviewSpot from './reviewSpot';
import sdp from './sdp';
import searchPortal from './searchPortal';
import seoPages from './seoPages';
import spotRequests from './spotRequests';
import user from './user';

/**
 * Build a fresh Vuex store. Used by vite-ssg's per-render factory in
 * `src/main.js` and by the lazy singleton below.
 *
 * @returns {import('vuex').Store}
 */
export function createAppStore() {
    return createStore({
        modules: {
            app,
            blog,
            bookingPortal,
            config,
            device,
            kycStatusPortal,
            map,
            myBookings,
            pendingPayments,
            registerRequest,
            reviewSpot,
            sdp,
            searchPortal,
            seoPages,
            spotRequests,
            user,
        },
    });
}

let lazySingleton = null;

/**
 * Lazy singleton accessor. Only constructed on the client side — and only
 * when something explicitly imports the default export — so the SSR pass
 * uses the per-render store from `createAppStore` and never touches this.
 *
 * @returns {import('vuex').Store}
 */
function getStore() {
    if (lazySingleton) {
        return lazySingleton;
    }
    if (typeof window === 'undefined') {
        throw new Error(
            '[store] Default singleton accessed during SSR. Use the ' +
                'per-render store created by main.js / createAppStore().',
        );
    }
    lazySingleton = createAppStore();
    return lazySingleton;
}

const storeProxyTarget = {};
const store = new Proxy(storeProxyTarget, {
    get(_target, prop) {
        const real = getStore();
        const value = Reflect.get(real, prop);
        return typeof value === 'function' ? value.bind(real) : value;
    },
    has(_target, prop) {
        return Reflect.has(getStore(), prop);
    },
});

export default store;
