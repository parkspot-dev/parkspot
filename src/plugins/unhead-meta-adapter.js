// Bridge between the legacy `metaInfo()` component option (a vue-meta 2.x
// convention) and @unhead/vue's useHead() composable.
//
// Why:
//   - vue-meta@2.4.0 is Vue 2 only. On Vue 3 its `metaInfo()` is silently
//     ignored, so the document <title> gets stuck on whatever the previous
//     full page load set it to. The 20+ existing views in this app all use
//     `metaInfo()`, and we do NOT want to rewrite each one -- that is both
//     noisy (1 diff per view) and risky (it's easy to miss a view).
//   - By installing this as a global mixin, every component that declares
//     `metaInfo()` automatically gets its value piped into useHead(), which
//     DOES work on Vue 3 and correctly updates the DOM on route changes.
//
// Design:
//   - `useHead` receives a getter function. @unhead runs it inside a
//     reactive effect, so whenever any reactive data accessed inside the
//     user's `metaInfo()` (e.g. `this.title`, `this.$route.params`) changes
//     the head is updated automatically.
//   - Title resolution mirrors vue-meta's behaviour: `titleTemplate` can be
//     either a "%s"-bearing string OR a function taking the raw title.
//   - On component unmount @unhead cleans up every tag this call created,
//     which is exactly what we want when navigating away.

import { useHead } from '@unhead/vue';

/**
 * Resolve vue-meta's {title, titleTemplate} pair into a single string,
 * tolerating undefined / null titles the way vue-meta does.
 *
 * Phase 2.5 hardening: if `title` is empty/whitespace AND the template
 * contains the `%s` placeholder, refuse to apply the template. The
 * legacy pattern `{ title: this.title, titleTemplate: 'ParkSpot | %s' }`
 * used by many views ships `this.title === undefined` on first render
 * (or whenever a route watcher hasn't fired yet) and produces an
 * orphan title like `'ParkSpot | '` with a trailing separator. That
 * leaks into Google SERP snippets and the browser tab. Returning an
 * empty string is treated by @unhead as a "no-op title" — the
 * previously-rendered title (typically the index.html shell) stays
 * intact, which is strictly better than emitting a broken brand
 * fragment. See ssg-research/04-integration-plan.md § Phase 2.5.
 *
 * @param {{ title?: unknown, titleTemplate?: string | ((t: string) => string) }} info
 * @returns {string}
 */
function resolveTitle(info) {
    const title = info.title == null ? '' : String(info.title);
    const template = info.titleTemplate;
    if (typeof template === 'function') {
        try {
            return String(template(title) ?? '');
        } catch {
            return title;
        }
    }
    if (typeof template === 'string' && template.length > 0) {
        if (template.includes('%s')) {
            // Defence-in-depth: an orphan template substitution
            // would produce visible artefacts like "ParkSpot | ".
            // Skip the substitution entirely when there's nothing
            // meaningful to slot in.
            if (title.trim() === '') return '';
            return template.replace('%s', title);
        }
        return template;
    }
    return title;
}

/**
 * Safely read the component's metaInfo() option.
 * @param {object} instance Vue component instance
 * @returns {object}
 */
function readMetaInfo(instance) {
    const fn = instance?.$options?.metaInfo;
    if (typeof fn !== 'function') return {};
    try {
        return fn.call(instance) || {};
    } catch (err) {
        console.warn('[unhead-meta-adapter] metaInfo() threw:', err);
        return {};
    }
}

export const metaInfoBridge = {
    // `created` fires after data/computed are set up but before the DOM is
    // mounted, which lets useHead establish the document <title> before
    // first paint -- matching vue-meta's historical timing.
    created() {
        if (typeof this.$options?.metaInfo !== 'function') return;

        useHead(() => {
            const info = readMetaInfo(this);
            return {
                title: resolveTitle(info),
                meta: Array.isArray(info.meta) ? info.meta : [],
                link: Array.isArray(info.link) ? info.link : [],
                script: Array.isArray(info.script) ? info.script : [],
                htmlAttrs: info.htmlAttrs || {},
                bodyAttrs: info.bodyAttrs || {},
            };
        });
    },
};

// Exposed so unit tests can exercise the title-template parser.
export const __test__ = { resolveTitle, readMetaInfo };
