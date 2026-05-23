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

import { ViteSSG as createViteSSG } from 'vite-ssg';
import { configure } from 'vee-validate';

import App from './App.vue';
import Buefy from 'buefy';
import VueDatePicker from '@vuepic/vue-datepicker';

import { routes, scrollBehavior } from './router';
import { createAppStore, seedAppStore } from './store';
import { metaInfoBridge } from './plugins/unhead-meta-adapter.js';
import { cleanupEdgeInjectedStructuredData } from './plugins/edge-seo-handoff.js';

configure({
    validateOnInput: true,
});

// Route-enumeration hook for vite-ssg. Re-exported as a top-level named
// export below — that's the only shape vite-ssg recognises. See
// `./utils/seo/included-routes.js` for the contract and rationale.
export { includedRoutes } from './utils/seo/included-routes.js';

export const createApp = createViteSSG(
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
        // Seed must precede `app.use` so module-level `import store from
        // '@/store'` subscribers (e.g. `onAuthStateChanged`) commit to
        // the same instance Vue components are wired to.
        seedAppStore(store);
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
                     
                    console.error('[main] AOS init failed:', err);
                });

            // Strip the edge-function-injected JSON-LD block so the
            // client-side head manager can emit a fresh, deduped copy.
            cleanupEdgeInjectedStructuredData();
        }
    },
);
