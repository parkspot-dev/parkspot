// Vue plugin that wires the app into New Relic:
//   - installs the agent-level error filter (./error-filter.js);
//   - reports component errors. Without an `errorHandler`, production
//     Vue only logs them with console.error, so the agent never sees them;
//   - reports router errors (failed lazy route chunks, guard exceptions);
//   - names SPA routes for BrowserInteraction and tags data with
//     `route_name`;
//   - keeps routes marked `meta: { sessionReplay: false }` out of session
//     replays.
//
//   app.use(telemetryPlugin, { router });
//
// Client-only. Does nothing when the agent isn't on the page.

import { createErrorFilter } from './error-filter.js';
import {
    disableSessionReplay,
    getAgent,
    reportError,
    setErrorFilter,
    setRouteName,
} from './index.js';

// Production builds pass a link such as
// https://vuejs.org/error-reference/#runtime-1 instead of a description.
const VUE_ERROR_REFERENCE = 'https://vuejs.org/error-reference/#';

// Route records are named in src/router/routes.js; the matched path
// pattern ("/spot-details/:id") is the fallback, never the actual URL.
function routeName(route) {
    if (typeof route.name === 'string') return route.name;
    return route.matched[route.matched.length - 1]?.path || 'unknown';
}

export const telemetryPlugin = {
    install(app, { router } = {}) {
        if (!getAgent()) return;
        setErrorFilter(createErrorFilter());

        const previousHandler = app.config.errorHandler;
        app.config.errorHandler = (err, instance, info) => {
            reportError(err, {
                source: 'vue',
                vue_info: String(info ?? '').replace(VUE_ERROR_REFERENCE, ''),
                component:
                    instance?.$options?.name || instance?.$options?.__name,
            });
            if (previousHandler) {
                previousHandler(err, instance, info);
            } else {
                // Registering a handler turns off Vue's own logging.
                console.error(err);
            }
        };

        if (!router) return;
        router.onError((err) => {
            reportError(err, { source: 'router' });
            // Same as above: a registered onError replaces the router's
            // console.error.
            console.error(err);
        });
        // beforeResolve runs once every guard has let the navigation
        // through, before the page renders: none of it is recorded, and a
        // redirect away (pending-payments sends non-admins home) doesn't
        // count. It runs for the first page too, before the app mounts and
        // the cookie notice can start replay.
        router.beforeResolve((to) => {
            if (to.meta?.sessionReplay === false) disableSessionReplay();
        });
        router.afterEach((to, from, failure) => {
            if (!failure) setRouteName(routeName(to));
        });
    },
};
