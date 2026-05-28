// Visual-test global setup. Imported via the `visual` project's
// `setupFiles` entry in vite.config.js. Runs once before every spec.
//
// Goals:
//   1. Load the same global stylesheets the production app uses so that
//      screenshots reflect production typography / colors / spacing.
//   2. Disable scroll-based animations (AOS) so capture timing is
//      deterministic -- otherwise an off-screen card would flicker
//      between "hidden" and "shown" depending on layout race.
//   3. Stub browser APIs that aren't available in headless Chromium for
//      every Vue component (e.g. matchMedia for components that branch
//      on viewport, IntersectionObserver for lazy-load cards).

import 'aos/dist/aos.css';
import 'buefy/dist/buefy.css';
import '@/styles/app.scss';

// Disable AOS animations entirely so first paint is the final paint.
// AOS reads body[data-aos-...] attributes; disabling via init({disable})
// keeps the stylesheet but skips the JS observer.
if (typeof window !== 'undefined') {
    window.matchMedia = window.matchMedia || ((q) => ({
        matches: false,
        media: q,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
    }));

    if (!('IntersectionObserver' in window)) {
        window.IntersectionObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
            takeRecords() { return []; }
        };
    }

    // Satisfy document.fonts.ready so Playwright's screenshot() does not
    // hang waiting for web fonts that will never load (the @import is
    // stripped at build time but font-family declarations remain).
    const fontFamilies = ['Poppins', 'Inter', 'Roboto', 'Rubik'];
    for (const family of fontFamilies) {
        document.fonts.add(new FontFace(family, 'local(sans-serif)'));
    }

    // Force CSS animations to terminate immediately so screenshots are
    // taken at the steady state. Cheaper than per-component overrides.
    const css = document.createElement('style');
    css.textContent = `
        *, *::before, *::after {
            animation-duration: 0s !important;
            animation-delay: 0s !important;
            transition-duration: 0s !important;
            transition-delay: 0s !important;
            scroll-behavior: auto !important;
        }
    `;
    document.head.appendChild(css);
}
