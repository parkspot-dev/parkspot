import { describe, expect, it } from 'vitest';
import {
    EVENTS,
    LEAD_TYPES,
    validateEvent,
    _getPiiKeys,
} from '@/lib/analytics/schema.js';

describe('analytics/schema', () => {
    describe('EVENTS / LEAD_TYPES', () => {
        it('exports the expected event-name set', () => {
            // Spot-check the events that downstream PRs depend on.
            expect(EVENTS.PAGE_VIEW).toBe('page_view');
            expect(EVENTS.GENERATE_LEAD).toBe('generate_lead');
            expect(EVENTS.PURCHASE).toBe('purchase');
            expect(EVENTS.BEGIN_CHECKOUT).toBe('begin_checkout');
            expect(EVENTS.PAYMENT_INITIATED).toBe('payment_initiated');
        });

        it('exports the five lead-type constants', () => {
            expect(LEAD_TYPES).toEqual({
                PARKING_SEEKER: 'parking_seeker',
                PARKING_OWNER: 'parking_owner',
                CONTACT: 'contact',
                TENTATIVE_BOOKING_AUTH: 'tentative_booking_auth',
                TENTATIVE_BOOKING_GUEST: 'tentative_booking_guest',
            });
        });

        it('EVENTS object is frozen so callers cannot mutate the taxonomy', () => {
            expect(Object.isFrozen(EVENTS)).toBe(true);
            expect(Object.isFrozen(LEAD_TYPES)).toBe(true);
        });
    });

    describe('validateEvent()', () => {
        it('throws on an unknown event name', () => {
            expect(() => validateEvent('not_a_real_event', {})).toThrow(
                /Unknown event/,
            );
        });

        it('throws when a required param is missing', () => {
            expect(() =>
                validateEvent(EVENTS.GENERATE_LEAD, {
                    funnel_name: 'vo_lead',
                    lead_type: LEAD_TYPES.PARKING_SEEKER,
                    value: 500,
                    currency: 'INR',
                    // enhanced_conversion_data missing
                }),
            ).toThrow(/missing required param "enhanced_conversion_data"/);
        });

        it('treats null / undefined / empty string as missing', () => {
            expect(() =>
                validateEvent(EVENTS.FUNNEL_VIEW, { funnel_name: '' }),
            ).toThrow(/missing required param "funnel_name"/);
            expect(() =>
                validateEvent(EVENTS.FUNNEL_VIEW, { funnel_name: null }),
            ).toThrow(/missing required param "funnel_name"/);
        });

        it('accepts 0 and false as present (truthy-coercion bug guard)', () => {
            expect(() =>
                validateEvent(EVENTS.FORM_START, {
                    funnel_name: 'vo_lead',
                    step_index: 0,
                }),
            ).not.toThrow();
        });

        it('passes when all required params are present', () => {
            expect(() =>
                validateEvent(EVENTS.GENERATE_LEAD, {
                    funnel_name: 'vo_lead',
                    lead_type: LEAD_TYPES.PARKING_SEEKER,
                    value: 500,
                    currency: 'INR',
                    enhanced_conversion_data: {
                        email_address: 'x@y.z',
                        phone_number: '+919999999999',
                    },
                }),
            ).not.toThrow();
        });

        describe('PII guard', () => {
            const piiKeys = _getPiiKeys();

            for (const piiKey of piiKeys) {
                it(`throws when "${piiKey}" appears at the top level of page_view`, () => {
                    expect(() =>
                        validateEvent(EVENTS.PAGE_VIEW, {
                            page_path: '/x',
                            page_title: 't',
                            [piiKey]: 'leak@example.com',
                        }),
                    ).toThrow(/PII at the top level/);
                });
            }

            it('allows PII inside enhanced_conversion_data on generate_lead', () => {
                expect(() =>
                    validateEvent(EVENTS.GENERATE_LEAD, {
                        funnel_name: 'contact',
                        lead_type: LEAD_TYPES.CONTACT,
                        value: 100,
                        currency: 'INR',
                        enhanced_conversion_data: {
                            email_address: 'visitor@example.com',
                            phone_number: '+919999999999',
                        },
                    }),
                ).not.toThrow();
            });

            it('allows PII inside enhanced_conversion_data on purchase', () => {
                expect(() =>
                    validateEvent(EVENTS.PURCHASE, {
                        funnel_name: 'booking',
                        transaction_id: 'tx_1',
                        value: 1500,
                        currency: 'INR',
                        items: [{ item_id: 'spot-1' }],
                        enhanced_conversion_data: {
                            email_address: 'buyer@example.com',
                            phone_number: '+919999999999',
                        },
                    }),
                ).not.toThrow();
            });

            it('rejects enhanced_conversion_data on a non-conversion event', () => {
                expect(() =>
                    validateEvent(EVENTS.PAGE_VIEW, {
                        page_path: '/x',
                        page_title: 't',
                        enhanced_conversion_data: {
                            email_address: 'x@y.z',
                        },
                    }),
                ).toThrow(/enhanced_conversion_data is only allowed/);
            });
        });
    });
});
