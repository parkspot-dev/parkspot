// Store entry. Exposes `createAppStore()` so `vite-ssg` can build a fresh
// Vuex store per render (preventing cross-route state pollution under SSR),
// plus a lazy `default` singleton so legacy `import store from '@/store'`
// call sites keep working unchanged.
//
// The default export is a Proxy that resolves to the store seeded by
// `main.js` via `seedAppStore()` on the client, and to an inert stub on
// the server. The seed step is what guarantees that module-level
// subscribers (e.g. `onAuthStateChanged` in `src/store/user/index.js`)
// mutate the same instance Vue components are wired to via `app.use`.

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
import spotSearch from './spotSearch';

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
            spotSearch,
        },
    });
}

let lazySingleton = null;

/**
 * An inert Vuex-shaped stub used as the default-export target during SSR.
 *
 * Route guards, route-level config getters and a handful of other legacy
 * call sites still do `import store from '@/store'; store.state.X.Y` at
 * module level. Throwing on SSR (an earlier attempt at this) made every
 * such site a build-time blocker — even though vite-ssg has no business
 * even firing those guards (`crawl: false` keeps the renderer to the URL
 * set returned by `includedRoutes`). The stub keeps the build resilient:
 * any guard that does fire sees an unauthenticated, empty world and
 * either calls `next()` straight through or redirects to a public page.
 *
 * The stub is intentionally read-mostly: `commit`/`dispatch` are no-ops
 * (so no SSR-side mutation can leak across renders), `state` and
 * `getters` are recursive empty proxies (so chained access like
 * `store.state.user.isAuthReady` is undefined rather than throwing).
 */
const noopState = () =>
    new Proxy(
        {},
        {
            get: (target, prop) => {
                if (prop === Symbol.toPrimitive) return () => '';
                if (prop === 'toJSON' || prop === Symbol.toStringTag) {
                    return undefined;
                }
                return noopState();
            },
            has: () => false,
        },
    );

const ssrStoreStub = Object.freeze({
    state: noopState(),
    getters: noopState(),
    commit: () => undefined,
    dispatch: () => Promise.resolve(),
    watch: () => () => undefined,
    subscribe: () => () => undefined,
    subscribeAction: () => () => undefined,
    replaceState: () => undefined,
    registerModule: () => undefined,
    unregisterModule: () => undefined,
    hasModule: () => false,
});

/**
 * Lazy singleton accessor. On the client, builds (and caches) a real
 * Vuex store via `createAppStore()` on first access. On the server,
 * returns the inert stub above — never the real store, since the real
 * store would (a) re-run side-effectful module subscriptions like
 * `onAuthStateChanged` and (b) leak state between renders.
 *
 * @returns {import('vuex').Store}
 */
function getStore() {
    if (lazySingleton) {
        return lazySingleton;
    }
    if (typeof window === 'undefined') {
        return ssrStoreStub;
    }
    lazySingleton = createAppStore();
    return lazySingleton;
}

/**
 * Register the canonical per-render client store. Must be called from
 * `main.js` BEFORE `app.use(store)` so module-level subscribers that
 * `import store from '@/store'` resolve to the same instance Vue
 * components are wired to. No-op during SSR — each vite-ssg render owns
 * its own short-lived store.
 *
 * @param {import('vuex').Store} store
 */
export function seedAppStore(store) {
    if (typeof window === 'undefined') return;
    lazySingleton = store;
}

export function __resetAppStoreSingletonForTests() {
    lazySingleton = null;
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
