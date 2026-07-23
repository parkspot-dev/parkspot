// PR-5 of conversion-tracking. TemplateSpotDetail owns the primary
// Google Ads conversion (`generate_lead`) for the booking funnel.
// There are two paths into this event:
//
//   - Auth path:  user already logged in -> createTentativeBooking()
//                 resolves -> generate_lead with
//                 lead_type=tentative_booking_auth, value=750.
//   - Guest path: user not logged in    -> createContactLead()
//                 resolves -> generate_lead with
//                 lead_type=tentative_booking_guest, value=500.
//
// Both paths share a sessionStorage-backed dedup set
// (`parkspot_fired_leads`) keyed on lead_type + spot id (+ booking
// id / email) to defend against double-clicks and back-button
// revisits. Locked conversion values come from plan.md §1.4 and must
// not be drifted accidentally.
//
// What we assert (highest-value invariants only):
//   - Auth path fires `generate_lead` once with the right shape and
//     PII confined to `enhanced_conversion_data` (top-level PII trips
//     the dev-mode validator and gets us yanked from GA4).
//   - Guest path fires `generate_lead` once with value=500 and
//     lead_type=tentative_booking_guest.
//   - `begin_checkout` fires when the modal opens.
//   - The `transaction_id` from the API booking id flows through
//     when present (Appendix B Q10).
//
// What we deliberately skip:
//   - The full Vee-Validate submit flow and toast assertions — those
//     are exercised by neighbouring component tests; here we drive
//     the analytics-bearing methods directly to keep the spec focused
//     on what PR-5 actually changed.
import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createStore } from 'vuex';

vi.mock('@/lib/analytics', async () => {
    const real = await vi.importActual('@/lib/analytics/schema.js');
    return {
        track: vi.fn(),
        EVENTS: real.EVENTS,
        LEAD_TYPES: real.LEAD_TYPES,
    };
});

import { track, EVENTS, LEAD_TYPES } from '@/lib/analytics';
import TemplateSpotDetail from '@/components/templates/TemplateSpotDetail.vue';

const SPOT = {
    SiteID: 'SPOT_42',
    Name: 'Indiranagar Covered',
    Rate: 5000,
    Address: '12th Main',
    Area: 'Indiranagar',
    City: 'Bangalore',
    Facilities: [],
};

function buildStore({
    isLoggedIn = true,
    isAdmin = false,
    isAgent = false,
    deleteSpot,
    createTentativeBooking,
    createContactLead,
} = {}) {
    return createStore({
        modules: {
            sdp: {
                namespaced: true,
                state: {
                    images: [],
                    thumbnail: [],
                    center: [12.97, 77.59],
                    isAvailable: true,
                    ownerInfoDetails: {},
                    paymentDetails: '',
                    selectedSpot: [SPOT],
                    spotDetails: SPOT,
                    spotInProgressBookings: null,
                },
                actions: {
                    updateImages: vi.fn(),
                    updateAddress: vi.fn(),
                    updateRent: vi.fn(),
                    deleteSpot: deleteSpot || vi.fn().mockResolvedValue({}),
                },
            },
            user: {
                namespaced: true,
                state: {
                    isAdmin: isAdmin,
                    isAgent: isAgent,
                    user: isLoggedIn ? { ID: 'U1' } : null,
                    userProfile: isLoggedIn
                        ? {
                              FullName: 'Alice',
                              EmailID: 'alice@example.com',
                              Mobile: '9876543210',
                          }
                        : {},
                },
            },
            bookingPortal: {
                namespaced: true,
                actions: {
                    createTentativeBooking:
                        createTentativeBooking || vi.fn().mockResolvedValue({}),
                    createContactLead:
                        createContactLead || vi.fn().mockResolvedValue({}),
                },
            },
        },
    });
}

const STUBS = {
    BodyWrapper: { template: '<div><slot /></div>' },
    SpotRateCard: {
        template: '<div data-testid="rate-card" />',
        emits: ['open-booking-modal', 'update-rent'],
    },
    MapContainer: { template: '<div data-testid="map" />' },
    OrganismImageGallery: { template: '<div data-testid="gallery" />' },
    MoleculeInfographicSteps: { template: '<div />' },
    AtomButton: { template: '<button><slot /></button>' },
    AtomDatePicker: { template: '<div />' },
    AtomTextarea: { template: '<div />' },
    OrganismBookingModal: {
        name: 'OrganismBookingModal',
        template: '<div data-testid="booking-modal" />',
        props: ['initialData'],
        emits: ['close', 'submitted', 'guest', 'login'],
    },
    LoaderModal: { template: '<div data-testid="loader" />' },
    ImageUpload: { template: '<div />' },
    AtomIcon: { template: '<i />' },
    OrganismAccountInformation: { template: '<div />' },
};

const mountTemplate = (store) =>
    mount(TemplateSpotDetail, {
        global: {
            plugins: [store],
            mocks: {
                $router: { push: vi.fn() },
                $buefy: {
                    toast: { open: vi.fn() },
                    dialog: { confirm: vi.fn() },
                },
            },
            stubs: STUBS,
        },
    });

describe('TemplateSpotDetail.vue — booking funnel generate_lead', () => {
    beforeEach(() => {
        track.mockClear();
        window.sessionStorage.clear();
    });

    afterEach(() => {
        vi.clearAllMocks();
        window.sessionStorage.clear();
    });

    it('fires begin_checkout when the booking modal opens', async () => {
        const wrapper = mountTemplate(buildStore({ isLoggedIn: true }));
        await wrapper.vm.openBookingModal();

        const beginCheckout = track.mock.calls.find(
            (c) => c[0] === EVENTS.BEGIN_CHECKOUT,
        );
        expect(beginCheckout).toBeTruthy();
        expect(beginCheckout[1]).toMatchObject({
            funnel_name: 'booking',
            step_index: 6,
            value: SPOT.Rate,
            currency: 'INR',
        });
        expect(beginCheckout[1].items[0]).toMatchObject({
            item_id: SPOT.SiteID,
            item_name: SPOT.Name,
            price: SPOT.Rate,
        });
        wrapper.unmount();
    });

    it('auth path: fires generate_lead with lead_type=tentative_booking_auth and value=750', async () => {
        const apiResponse = { BookingID: 'BK_99' };
        const store = buildStore({
            isLoggedIn: true,
            createTentativeBooking: vi.fn().mockResolvedValue(apiResponse),
        });
        const wrapper = mountTemplate(store);

        await wrapper.vm.handleBookingSubmit({
            fullName: 'Alice',
            email: 'alice@example.com',
            mobile: '9876543210',
            vehicleNo: 'KA01AB1234',
        });
        await flushPromises();

        const leadCalls = track.mock.calls.filter(
            (c) => c[0] === EVENTS.GENERATE_LEAD,
        );
        expect(leadCalls).toHaveLength(1);
        const params = leadCalls[0][1];
        expect(params).toMatchObject({
            funnel_name: 'booking',
            step_index: 8,
            lead_type: LEAD_TYPES.TENTATIVE_BOOKING_AUTH,
            value: 750,
            currency: 'INR',
            transaction_id: 'BK_99',
        });
        // PII must live only inside enhanced_conversion_data.
        expect(params).not.toHaveProperty('email_address');
        expect(params).not.toHaveProperty('phone_number');
        expect(params.enhanced_conversion_data).toEqual({
            email_address: 'alice@example.com',
            phone_number: '+919876543210',
        });
        expect(params.items[0]).toMatchObject({
            item_id: SPOT.SiteID,
            item_name: SPOT.Name,
            price: SPOT.Rate,
        });

        wrapper.unmount();
    });

    it('auth path: dedupes generate_lead on repeat submit with same booking id', async () => {
        const apiResponse = { BookingID: 'BK_99' };
        const store = buildStore({
            isLoggedIn: true,
            createTentativeBooking: vi.fn().mockResolvedValue(apiResponse),
        });
        const wrapper = mountTemplate(store);

        const form = {
            fullName: 'Alice',
            email: 'alice@example.com',
            mobile: '9876543210',
            vehicleNo: 'KA01AB1234',
        };
        await wrapper.vm.handleBookingSubmit(form);
        await flushPromises();
        await wrapper.vm.handleBookingSubmit(form);
        await flushPromises();

        const leadCalls = track.mock.calls.filter(
            (c) => c[0] === EVENTS.GENERATE_LEAD,
        );
        expect(leadCalls).toHaveLength(1);

        wrapper.unmount();
    });

    it('guest path: fires generate_lead with lead_type=tentative_booking_guest and value=500', async () => {
        const store = buildStore({
            isLoggedIn: false,
            createContactLead: vi.fn().mockResolvedValue({}),
        });
        const wrapper = mountTemplate(store);

        await wrapper.vm.handleGuestBooking({
            fullName: 'Bob',
            email: 'bob@example.com',
            mobile: '9123456780',
            vehicleNo: 'KA02CD5678',
        });
        await flushPromises();

        const leadCalls = track.mock.calls.filter(
            (c) => c[0] === EVENTS.GENERATE_LEAD,
        );
        expect(leadCalls).toHaveLength(1);
        const params = leadCalls[0][1];
        expect(params).toMatchObject({
            funnel_name: 'booking',
            step_index: 8,
            lead_type: LEAD_TYPES.TENTATIVE_BOOKING_GUEST,
            value: 500,
            currency: 'INR',
        });
        expect(params).not.toHaveProperty('transaction_id');
        expect(params.enhanced_conversion_data).toEqual({
            email_address: 'bob@example.com',
            phone_number: '+919123456780',
        });

        wrapper.unmount();
    });

    describe('spot deletion feature', () => {
        it('does not render Delete button when user is not an admin', () => {
            const wrapper = mountTemplate(buildStore({ isAdmin: false }));
            expect(wrapper.find('.delete-btn').exists()).toBe(false);
            wrapper.unmount();
        });

        it('renders Delete button when user is an admin', () => {
            const wrapper = mountTemplate(buildStore({ isAdmin: true }));
            expect(wrapper.find('.delete-btn').exists()).toBe(true);
            wrapper.unmount();
        });

        it('confirmDeleteSpot opens $buefy.dialog.confirm with danger and primary cancel options', async () => {
            const deleteSpotMock = vi.fn().mockResolvedValue({});
            const store = buildStore({
                isAdmin: true,
                deleteSpot: deleteSpotMock,
            });
            const wrapper = mountTemplate(store);

            let confirmOptions;
            wrapper.vm.$buefy.dialog.confirm = vi.fn((opts) => {
                confirmOptions = opts;
            });

            await wrapper.vm.confirmDeleteSpot();

            expect(wrapper.vm.$buefy.dialog.confirm).toHaveBeenCalled();
            expect(confirmOptions).toMatchObject({
                title: 'Delete Spot',
                type: 'is-danger',
                cancelType: 'is-primary',
            });
            expect(confirmOptions.message).toBe(
                'Are you sure you want to delete this spot?',
            );

            // Trigger onConfirm handler
            await confirmOptions.onConfirm();
            expect(deleteSpotMock).toHaveBeenCalled();
            expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/');

            wrapper.unmount();
        });
    });
});
