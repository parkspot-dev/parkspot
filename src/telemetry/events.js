// Event taxonomy for New Relic PageActions. Dashboards and alerts query
// these names, so add a constant here (and to the PageAction table in
// observability/newrelic/README.md) rather than passing ad-hoc strings to
// `trackEvent()`.

import { EVENTS } from '@/lib/analytics/schema.js';

/**
 * Telemetry-only events, i.e. ones that have no GA4 counterpart.
 */
export const NR_EVENTS = Object.freeze({
    // Outcome of the Cashfree return leg on /payment/*:
    // { status: 'paid' | 'pending' | 'failed' | 'unknown', error_code,
    //   order_status }. `error_code` comes with 'failed', and
    // `order_status` (Maya's raw Status) with an unrecognised reply.
    PAYMENT_STATUS: 'payment_status',
});

/**
 * Analytics events that `track()` mirrors to New Relic, so funnel
 * drop-offs can be lined up with errors and latency in one place.
 * Left out on purpose: page_view (PageView / BrowserInteraction already
 * cover it), view_item_list (high volume, low signal), and identify /
 * set_user_property (identity is set via `setUser()` instead).
 */
export const FORWARDED_ANALYTICS_EVENTS = Object.freeze([
    EVENTS.FUNNEL_VIEW,
    EVENTS.FORM_START,
    EVENTS.FORM_ERROR,
    EVENTS.FORM_SUBMIT_ATTEMPT,
    EVENTS.IMAGE_UPLOAD_START,
    EVENTS.IMAGE_UPLOAD_COMPLETE,
    EVENTS.GENERATE_LEAD,
    EVENTS.LEAD_CONFIRMED,
    EVENTS.SEARCH,
    EVENTS.VIEW_SEARCH_RESULTS,
    EVENTS.SELECT_ITEM,
    EVENTS.VIEW_ITEM,
    EVENTS.BEGIN_CHECKOUT,
    EVENTS.PAYMENT_INITIATED,
    EVENTS.PURCHASE,
    EVENTS.PURCHASE_CONFIRMED,
]);
