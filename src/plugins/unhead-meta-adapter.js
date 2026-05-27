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
 * Resolve vue-meta's {title, titleTemplate} pair into a single value
 * suitable for `useHead({ title })`, tolerating undefined / null titles
 * the way vue-meta did.
 *
 * Return contract:
 *   - string  → the resolved <title> to render.
 *   - undefined → "this entry contributes no title" — let earlier
 *     `useHead` registrations (parent components, the index.html shell)
 *     stand. @unhead treats an `undefined` title in the payload as
 *     "skip" rather than "clear", which is exactly what we want when a
 *     component genuinely has no title to express.
 *
 * Hardening (Phase 2.5 + Phase 2.5b):
 *   - **Orphan template suppression (2.5):** if `title` is
 *     empty/whitespace AND the template contains `%s`, refuse to
 *     apply the template. The legacy pattern
 *     `{ title: this.title, titleTemplate: 'ParkSpot | %s' }` used
 *     by many views shipped `this.title === undefined` on first render
 *     and produced an orphan `'ParkSpot | '` with a trailing
 *     separator that leaked into Google SERP snippets.
 *   - **Sibling collision suppression (2.5b):** if the component
 *     genuinely has nothing to say about the title (no `title`, no
 *     `titleTemplate`), return `undefined` rather than `''`. The
 *     legacy `''` was indistinguishable from "I want an empty
 *     title" — which @unhead would honour by overriding sibling /
 *     parent entries with the empty string. `undefined` lets the
 *     parent's title stand. This is the failsafe that catches the
 *     class of bug fixed structurally in Phase 2.5b (PageHome /
 *     PageBlogPost embedding `Page*` instead of `Template*`).
 *
 * See ssg-research/04-integration-plan.md § Phase 2.5 / 2.5b.
 *
 * @param {{ title?: unknown, titleTemplate?: string | ((t: string) => string) }} info
 * @returns {string|undefined}
 */
function resolveTitle(info) {
    const rawTitle = info.title;
    const template = info.titleTemplate;
    const title = rawTitle == null ? '' : String(rawTitle);
    const hasTitle = title.trim() !== '';

    if (typeof template === 'function') {
        try {
            const out = template(title);
            return out == null ? undefined : String(out);
        } catch {
            return hasTitle ? title : undefined;
        }
    }
    if (typeof template === 'string' && template.length > 0) {
        if (template.includes('%s')) {
            // Orphan substitution would produce "ParkSpot | ".
            // Skip entirely when there's nothing to slot in.
            if (!hasTitle) return undefined;
            return template.replace('%s', title);
        }
        return template;
    }
    // No template — fall back to the raw title (or `undefined` if
    // there's nothing meaningful to emit).
    return hasTitle ? title : undefined;
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

/**
 * Build the `useHead` payload from a vue-meta-style `metaInfo` object.
 * Splits out from the mixin so unit tests can exercise the shape
 * without standing up a Vue component tree.
 *
 * The `title` key is OMITTED (not set to `undefined`) when there's no
 * title to contribute. That's the difference between "this entry
 * abstains from setting the title" (parent / index.html wins) and
 * "this entry wants the title to be the empty string" (would clobber
 * siblings). @unhead handles both inputs, but omitting the key is the
 * more honest signal of intent and is robust across @unhead versions.
 *
 * @param {object} info  output of `metaInfo()`
 * @returns {object} payload for `useHead`
 */
function buildHeadPayload(info) {
    const title = resolveTitle(info);
    const payload = {
        meta: Array.isArray(info.meta) ? info.meta : [],
        link: Array.isArray(info.link) ? info.link : [],
        script: Array.isArray(info.script) ? info.script : [],
        htmlAttrs: info.htmlAttrs || {},
        bodyAttrs: info.bodyAttrs || {},
    };
    if (title !== undefined) payload.title = title;
    return payload;
}

export const metaInfoBridge = {
    // `created` fires after data/computed are set up but before the DOM is
    // mounted, which lets useHead establish the document <title> before
    // first paint -- matching vue-meta's historical timing.
    created() {
        if (typeof this.$options?.metaInfo !== 'function') return;

        useHead(() => buildHeadPayload(readMetaInfo(this)));
    },
};

// Exposed so unit tests can exercise the title-template parser
// and the payload builder without standing up a Vue render tree.
export const __test__ = { resolveTitle, readMetaInfo, buildHeadPayload };
