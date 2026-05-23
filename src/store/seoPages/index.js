// Vuex module backing the SEO area pages (`/bangalore/parking-near-*`,
// `/hyderabad/parking-near-*`). The module exists specifically so SSR-fetched
// data survives the SSG → client hand-off without a hydration mismatch:
//
//   1. During `vite-ssg` prerender, `PageNearBy.vue#serverPrefetch`
//      dispatches `seoPages/loadPage`, which fetches the slug payload via
//      the build-time REST helper (`utils/seo/rtdb-build.js`) and commits
//      it to `state.byLocation[slug]`.
//   2. `main.js` snapshots the final SSR state into `initialState.store`,
//      which vite-ssg serializes into the prerendered HTML.
//   3. On client mount, `replaceState(initialState.store)` puts the data
//      back into the live store, so the `spotsForLocation` getter is
//      already populated by the time `mounted()` runs and the client
//      skips the re-fetch.
//
// On the client this module falls back to `getValueFromFirebase`, which is
// what the SPA used before SSG. SSR vs. client is detected via
// `import.meta.env.SSR` so the right path is tree-shaken out of each bundle.

import { getValueFromFirebase } from '@/firebase';

const state = () => ({
    /** @type {Record<string, { Sites?: unknown[] } | null>} */
    byLocation: {},
});

const mutations = {
    setPage(state, { location, data }) {
        state.byLocation = { ...state.byLocation, [location]: data };
    },
};

const actions = {
    /**
     * Load a single slug's payload. Idempotent: a second call for the same
     * slug short-circuits to the cached entry.
     *
     * @param {{ state: any, commit: Function }} ctx
     * @param {string} location
     * @returns {Promise<{ Sites?: unknown[] } | null>}
     */
    async loadPage({ state, commit }, location) {
        if (!location || typeof location !== 'string') {
            return null;
        }
        if (Object.prototype.hasOwnProperty.call(state.byLocation, location)) {
            return state.byLocation[location];
        }

        let data = null;
        try {
            if (import.meta.env.SSR) {
                // Build-time path. Lazy-imported so the module isn't pulled
                // into the client bundle.
                const { fetchSeoPage } = await import(
                    '@/utils/seo/rtdb-build.js'
                );
                data = await fetchSeoPage(location);
            } else {
                data = await getValueFromFirebase(`seo-pages/${location}`);
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(
                `[store/seoPages] loadPage("${location}") failed:`,
                err,
            );
            data = null;
        }

        commit('setPage', { location, data });
        return data;
    },
};

const getters = {
    pageForLocation: (state) => (location) =>
        state.byLocation[location] || null,
    spotsForLocation: (state) => (location) => {
        const page = state.byLocation[location];
        return page && Array.isArray(page.Sites) ? page.Sites : [];
    },
    hasLoadedLocation: (state) => (location) =>
        Object.prototype.hasOwnProperty.call(state.byLocation, location),
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
