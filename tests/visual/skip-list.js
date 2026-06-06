// Visual-regression smoke test skip-list.
//
// We auto-discover every .vue file under src/components and try to
// mount + screenshot it. Some components are not screenshotable in
// isolation under headless Chromium for fundamental reasons (3rd-party
// SDKs, WebGL, auth-gated state, missing required props, store-shape
// mismatches). Those go here with an explicit reason so the failure
// is informative instead of mysterious.
//
// Adding to this list is a deliberate choice. If a component appears
// here it is NOT covered by visual regression -- treat the entry as a
// known gap that should be solved with a hand-crafted spec under
// tests/visual/templates/ when the component matters enough.
export const SKIP = [
   // ─── 3rd-party SDKs / WebGL / portals ──────────────────────────
   { match: /MapboxMap|TemplateMap|MoleculeMap|MapView|MapContainer/i,
     reason: 'WebGL / Mapbox' },
   { match: /Cashfree|PaymentDrop|PaymentGateway/i,
     reason: 'Cashfree SDK' },
   { match: /AtomChat/i, reason: '3rd-party live chat iframe' },
   { match: /AtomDatePicker/i, reason: 'portals to body' },
   // ─── Auth / API state required at mount ────────────────────────
   { match: /OrganismLogin/i, reason: 'requires firebase auth state' },
   { match: /PageSearchPortal/i,
     reason: 'requires authenticated userProfile' },
   { match: /TemplateBookingPortal|TemplateMyBookings|TemplateKYC/i,
     reason: 'fetches APIs at mount' },
   { match: /TemplateSearchPortal|TemplateSpotsSearch|TemplateRegisterRequest|TemplateSpotRequest/i,
     reason: 'admin data deps' },
   // ─── b-table scoped-slot templates ─────────────────────────────
   { match: /ActiveBookings|PageSpotRequest|SpotRequest|PageKYCStatus/i,
     reason: 'b-table scoped-slot template, needs parent table context' },
   // ─── Cards / forms with required props ─────────────────────────
   { match: /TestimonialCard|TopSearchesCard/i,
     reason: 'requires `item` prop, no skeleton state' },
   { match: /MoleculeCheckbox|MoleculeRadioButton|MoleculeSelectInput|MoleculeUpload/i,
     reason: 'requires vee-validate errors[] from parent form' },
   { match: /MoleculePaymentCard|MoleculeProductCard|MoleculeSRPCard/i,
     reason: 'requires data prop (no skeleton state)' },
   { match: /OrganismAddressForm|OrganismAdditionalInfo|OrganismPreferenceForm|OrganismSpotRateCard|OrganismUserGeneralInfo/i,
     reason: 'composes form primitives that need errors / domain props' },
   // ─── Store-shape cascades ──────────────────────────────────────
   { match: /OrganismHomeCard|TemplateHomeBanner|TemplateVOPortal|SearchInput|SearchComponent|PageHome|PageVOPortal/i,
     reason: 'depends on map/getLocationName store array' },
   { match: /TemplateSrp|TemplateSpotDetail|PageSpotDetail|BookingPortal/i,
     reason: 'reads sdp.* / spotRequests.* state not seeded by fake store' },
   // ─── Form views that expect populated parent flow ──────────────
   { match: /RegisterRequest|ReviewSpot/i,
     reason: 'requires formData / SO state seeded by parent flow' },
   // ─── Views that perform router/store work eagerly ──────────────
   { match: /PageBlogPost|PageMyBookings|PageNearBy|PageSrp/i,
     reason: 'mounts perform router/store work that needs real data' },
   // ─── Atoms ─────────────────────────────────────────────────────
   // Atoms render essentially nothing visible without props (mostly
   // empty wrappers around Buefy / native elements). Their visual
   // surface is exercised transitively by molecules / organisms.
   // Standalone screenshots are blank PNGs that provide no signal.
   { match: /\/components\/atoms\//,
     reason: 'atoms covered transitively; standalone render is empty' },
   // ─── Source-side defects (tracked in KNOWN_ISSUES.md) ──────────
   { match: /t-features-page/i,
     reason: 'Vue 3 <Transition> compile error in source (see KNOWN_ISSUES.md)' },
   // ─── Nav chrome — depends on every named route ─────────────────
   // Mounted in isolation, <router-link :to="{ name: '...' }"> for
   // any route the fake router doesn't know about throws. The fake
   // router's resolve() now degrades gracefully (test-helpers.js),
   // but keep these skip-listed in case a future router shape change
   // breaks resolution again — they have negligible regression value.
   { match: /TemplateFooter|NavbarBody/i,
     reason: 'depends on every named route in src/router/index.js' },
   // ─── External network resources in CSS/template ─────────────────
   { match: /AutomateParking/i,
     reason: 'external background-image URL blocks network idle' },
   // ─── Hand-crafted specs (skip auto-discovery to avoid duplication) ─
   { match: /TemplateBlogHome|TemplateNearBy/i,
     reason: 'covered by dedicated hand-crafted spec under tests/visual/templates/' },
   // ─── Scratch / placeholder ─────────────────────────────────────
   { match: /\/temp\.vue|PageTemp\.vue|ExampleComponent\.vue/i,
     reason: 'scratch / placeholder' },
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
