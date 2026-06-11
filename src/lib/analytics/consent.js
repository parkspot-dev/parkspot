// Consent Mode v2 wrapper. Used by PR-2 (consent notice) but ships in
// PR-1 so the public API is stable from day one.
//
// Per plan.md §1.7 / §2.8, parkspot's posture is disclosure-only: the
// notice strip never changes consent flags. These helpers exist so the
// posture is reversible — flipping all four flags to `denied` and
// adding Accept buttons becomes a one-PR change.
//
// `gtag('consent', 'default', ...)` MUST run before any GTM/gtag.js
// snippet. The intent is for `index.html` to call `setDefault()` inline
// (or for the equivalent inline gtag block to be hand-written into
// `index.html`), not for a Vue component to call it post-mount.

import { gtag } from './dataLayer.js';

/**
 * Set the Consent Mode v2 default state. This MUST run before the GTM
 * snippet so the very first page-view respects the chosen defaults.
 *
 * @param {{
 *   ad_storage?: 'granted' | 'denied',
 *   ad_user_data?: 'granted' | 'denied',
 *   ad_personalization?: 'granted' | 'denied',
 *   analytics_storage?: 'granted' | 'denied',
 *   functionality_storage?: 'granted' | 'denied',
 *   personalization_storage?: 'granted' | 'denied',
 *   security_storage?: 'granted' | 'denied',
 *   wait_for_update?: number,
 *   region?: string[]
 * }} consent
 */
export function setDefault(consent) {
    gtag('consent', 'default', consent || {});
}

/**
 * Update Consent Mode v2 state in response to a user choice (e.g. when
 * a future Accept/Reject banner ships). No-op on the server.
 *
 * @param {Record<string, 'granted' | 'denied'>} consent
 */
export function update(consent) {
    gtag('consent', 'update', consent || {});
}
