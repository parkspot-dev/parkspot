// SSG-aware entry. Wraps the SPA bootstrap inside a `vite-ssg` factory so each
// SEO-critical route can be statically pre-rendered at build time. Runtime
// behaviour on the client is identical to the previous SPA: same plugins,
// same store, same router — only the Vuex store and head context are now
// created per render so SSR state never leaks across pages.
//
// `vite-ssg` ships and wires `@unhead/vue` v2 internally, so we do NOT call
// `createHead()` / `app.use(head)` here — doing so would create two head
// contexts and the `metaInfoBridge` mixin's `useHead()` calls would land in
// the wrong one.

import 'aos/dist/aos.css';
import 'buefy/dist/buefy.css';
import '@vuepic/vue-datepicker/dist/main.css';

import { ViteSSG } from 'vite-ssg';
import { configure } from 'vee-validate';

import App from './App.vue';
import Buefy from 'buefy';
import VueDatePicker from '@vuepic/vue-datepicker';

import { routes, scrollBehavior } from './router';
import { createAppStore } from './store';
import { metaInfoBridge } from './plugins/unhead-meta-adapter.js';
import { cleanupEdgeInjectedStructuredData } from './plugins/edge-seo-handoff.js';

configure({
    validateOnInput: true,
});

// Exact paths that are SPA-only by design (client redirects, scratch
// pages, transactional status pages). Excluded from `includedRoutes`
// so they never enter the prerender set.
const SSG_EXCLUDED_EXACT = new Set([
    '/app',
    '/temp',
    '/thank-you',
    '/error',
]);

export const createApp = ViteSSG(
    App,
    { routes, scrollBehavior },
    ({ app, isClient, initialState }) => {
        // Per-render Vuex store. On SSR we snapshot the final state into
        // `initialState.store` (serialized into HTML); on client we restore
        // from that snapshot so `serverPrefetch`-populated data survives
        // hydration without a re-fetch.
        const store = createAppStore();
        if (import.meta.env.SSR) {
            initialState.store = store.state;
        } else if (initialState && initialState.store) {
            store.replaceState(initialState.store);
        }
        app.use(store);

        // Global bridge: every component with the legacy `metaInfo()` option
        // gets its values piped into @unhead/vue automatically. Same shape
        // master already shipped via PR #743.
        app.mixin(metaInfoBridge);

        // Buefy and VueDatePicker are template-only Vue libs with no
        // module-eval window/document access — safe to register on both
        // server and client. Synchronous registration keeps component
        // resolution stable on first paint (matches Buefy pattern; fixes
        // the dynamic-import timing flagged in §0.1.b of the checklist).
        app.use(Buefy);
        app.component('VueDatePicker', VueDatePicker);

        if (isClient) {
            // Browser-only side effects. AOS reads `document` at import-time
            // inside its IIFE, so it is loaded dynamically post-hydration.
            import('aos')
                .then(({ default: AOS }) => {
                    AOS.init({
                        offset: 120,
                        delay: 0,
                        duration: 1500,
                        easing: 'ease',
                        once: true,
                        anchorPlacement: 'top-bottom',
                    });
                })
                .catch((err) => {
                    // eslint-disable-next-line no-console
                    console.error('[main] AOS init failed:', err);
                });

            // Strip the edge-function-injected JSON-LD block so the
            // client-side head manager can emit a fresh, deduped copy.
            cleanupEdgeInjectedStructuredData();
        }
    },
    {
        // Route enumeration: include every Vue-Router path plus the area
        // pages we discover at build time via RTDB. Failures during
        // enumeration must NOT block the build — falling back to the
        // static path set still produces a useful SPA shell for unknown
        // routes (Netlify's `_redirects` catches them).
        //
        // Excluded sets:
        //   - `/internal/*`, `/payment/*`, `/profile/*`, `/user/*`
        //     auth-gated; route guards in `routes.js` already redirect
        //     unauthenticated callers, so prerendering them just produces
        //     SPA-shell HTML at the wrong canonical URL.
        //   - paths with a `:` param placeholder — can't be prerendered
        //     without a slug list (spot-details / payment-gateway are
        //     out of scope for Phase 1+2).
        //   - paths in `SSG_EXCLUDED_EXACT` (see module-scope set above):
        //     client-only redirects, scratchpads or transactional status
        //     pages. They should never appear in search results.
        async includedRoutes(paths, _routes) {
            const filtered = paths.filter(
                (p) =>
                    !p.startsWith('/internal/') &&
                    !p.startsWith('/payment/') &&
                    !p.startsWith('/profile/') &&
                    !p.startsWith('/user/') &&
                    !p.includes(':') &&
                    !SSG_EXCLUDED_EXACT.has(p),
            );

            try {
                const { fetchAllSeoSlugs } = await import(
                    './utils/seo/rtdb-build.js'
                );
                const { bangalore, hyderabad } = await fetchAllSeoSlugs();
                // Trailing slash on area pages so `vite-ssg` emits the
                // file as `dist/<city>/parking-near-<slug>/index.html`,
                // matching the canonical URL the edge function (and
                // `to-head.js`) already declares. Fixes §0.1.c.
                return [
                    ...filtered,
                    ...bangalore.map(
                        (s) => `/bangalore/parking-near-${s}/`,
                    ),
                    ...hyderabad.map(
                        (s) => `/hyderabad/parking-near-${s}/`,
                    ),
                ];
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error(
                    '[ssg] RTDB enumeration failed; shipping static routes only',
                    err,
                );
                return filtered;
            }
        },
    },
);
