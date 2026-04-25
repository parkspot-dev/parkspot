// Visual-regression smoke test skip-list.
//
// We auto-discover every .vue file under src/components and try to
// mount + screenshot it. Some components are not screenshotable in
// isolation under headless Chromium for fundamental reasons (3rd-party
// SDKs, WebGL, auth-gated state). Those go here with an explicit
// reason so the failure is informative instead of mysterious.
//
// Adding to this list is a deliberate choice. If a component appears
// here it is NOT covered by visual regression -- treat the entry as a
// known gap that should be solved with a hand-crafted spec under
// tests/visual/templates/ when the component matters enough.

export const SKIP = [
    // Mapbox GL needs WebGL + a real map style fetch; headless tests
    // intermittently render an unstyled <canvas> which produces flaky
    // diffs.
    { match: /MapboxMap|TemplateMap|MoleculeMap|MapView/i, reason: 'WebGL / Mapbox' },

    // Loads the Cashfree drop-in JS at runtime. Cannot be exercised
    // without a real merchant session token.
    { match: /Cashfree|PaymentDrop|PaymentGateway/i, reason: 'Cashfree SDK' },

    // Embeds an iframe to a 3rd-party live-chat widget.
    { match: /AtomChat/i, reason: '3rd-party live chat iframe' },

    // Login modal binds against firebase auth state on mount.
    { match: /OrganismLogin/i, reason: 'requires firebase auth state' },

    // The "BookingPortal" / "MyBookings" trees fetch the current user's
    // bookings from Firebase on mount; they have explicit hand-crafted
    // specs in tests/visual/templates/ where useful.
    { match: /TemplateBookingPortal|TemplateMyBookings|TemplateKYC/i, reason: 'fetches APIs at mount' },

    // Internal "search portal" admin tree: heavy data deps.
    { match: /TemplateSearchPortal|TemplateSpotsSearch|TemplateRegisterRequest|TemplateSpotRequest/i, reason: 'admin data deps' },

    // Vue-datepicker injects a portal popup that escapes the mount
    // container; screenshot diffs are misleading.
    { match: /AtomDatePicker/i, reason: 'portals to body' },

    // Temp / scratch files.
    { match: /\/temp\.vue|PageTemp\.vue|ExampleComponent\.vue/i, reason: 'scratch / placeholder' },
];

/**
 * @param {string} filePath e.g. "/src/components/atoms/AtomChat.vue"
 * @returns {string|null} a human-readable reason, or null if not skipped.
 */
export function skipReason(filePath) {
    for (const entry of SKIP) {
        if (entry.match.test(filePath)) return entry.reason;
    }
    return null;
}
