// `navigator` is not a real browser global on the SSR pass (Node 21+
// exposes a stub that returns a value like "Node.js/22.22.3"). Storing
// that string in component-readable state pollutes the hydration
// snapshot vite-ssg serializes into HTML — the client would then read a
// stale, wrong UA until something else updated it. Expose the UA via a
// getter so it's evaluated lazily in whichever environment is asking,
// keeping `state` itself empty and free of stale browser-globals.
const state = () => ({
    regexp: /android|iphone|kindle|ipad/i,
});

const getters = {
    details: () =>
        typeof navigator === 'undefined' ? '' : navigator.userAgent,
};

export default {
    namespaced: true,
    state,
    getters,
};
