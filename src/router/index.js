// Router module. Exports the route table and `scrollBehavior` so vite-ssg
// can build a fresh router per render, while still providing a lazy
// singleton `default` export for code paths that historically did
// `import router from '@/router'` and called `router.push(...)`.

import { createRouter, createWebHistory } from 'vue-router';

import { routes } from './routes.js';

/**
 * scrollBehavior is intentionally pure and SSR-safe: it never touches
 * `window` or `document` directly. `savedPosition` is the only browser-coming
 * argument and is `null` on the very first navigation in either environment.
 */
export const scrollBehavior = (_to, _from, savedPosition) => {
    if (savedPosition) {
        return savedPosition;
    }
    return { top: 0, behavior: 'smooth' };
};

export { routes };

let lazySingleton = null;

/**
 * Lazily-constructed client-only router instance. We only build it when a
 * legacy caller asks for it, so that on the SSR pass — where `vite-ssg`
 * supplies its own router via the factory — we never create a parallel
 * `createWebHistory` (which would touch `window`/`document`).
 *
 * @returns {import('vue-router').Router}
 */
export function getRouter() {
    if (lazySingleton) {
        return lazySingleton;
    }

    if (typeof window === 'undefined') {
        throw new Error(
            '[router] getRouter() called during SSR — use the router instance ' +
                'provided by vite-ssg via app.$router instead.',
        );
    }

    lazySingleton = createRouter({
        history: createWebHistory(import.meta.env.BASE_URL),
        routes,
        scrollBehavior,
    });
    return lazySingleton;
}

// Backwards-compatible default export. We expose a Proxy so that the typical
// `import router from '@/router'; router.push(...)` keeps working without
// eagerly constructing the singleton at module-evaluation time (which would
// fire during SSR import). Methods are forwarded to the real instance.
const routerProxyTarget = {};
const router = new Proxy(routerProxyTarget, {
    get(_target, prop) {
        const real = getRouter();
        const value = Reflect.get(real, prop);
        return typeof value === 'function' ? value.bind(real) : value;
    },
    has(_target, prop) {
        return Reflect.has(getRouter(), prop);
    },
});

export default router;
