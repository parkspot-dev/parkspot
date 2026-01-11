import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createStore } from 'vuex';
import PageMyBooking from '@/views/PageMyBookings.vue';

describe('PageMyBooking.vue', () => {
    let wrapper;
    let store;
    let fetchUserBookingsMock;

    const activeBookings = [
        { BookingID: 101, SiteDetails: { SiteName: 'Active Site' } },
    ];

    const pastBookings = [
        { BookingID: 201, SiteDetails: { SiteName: 'Past Site' } },
    ];

    const requestedBookings = [
        { BookingID: 301, SiteDetails: { SiteName: 'Request Site' } },
    ];

    const mountComponent = ({
        active = activeBookings,
        past = pastBookings,
        request = requestedBookings,
    } = {}) => {
        fetchUserBookingsMock = vi.fn(() => Promise.resolve());

        store = createStore({
            modules: {
                myBookings: {
                    namespaced: true,
                    state: () => ({
                        isLoading: false,
                        hasError: false,
                        errorMessage: '',
                        activeBookings: active,
                        pastBookings: past,
                        requestedBookings: request,
                    }),
                    actions: {
                        fetchUserBookings: fetchUserBookingsMock,
                    },
                },
            },
        });

        wrapper = mount(PageMyBooking, {
            global: {
                plugins: [store],
                stubs: {
                    BookingSidebar: true,
                    BookingDetails: {
                        template:
                            '<div class="booking-details">Booking Details</div>',
                    },
                },
            },
        });
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(window.history, 'replaceState').mockImplementation(() => {});
        vi.spyOn(window, 'URLSearchParams').mockImplementation(() => ({
            get: () => null,
        }));
    });

    afterEach(() => {
        wrapper?.unmount();
        vi.restoreAllMocks();
    });

    it('renders page title', async () => {
        mountComponent();
        await flushPromises();
        expect(wrapper.text()).toContain('My Bookings');
    });

    it('fetches user bookings on mount', async () => {
        mountComponent();
        await flushPromises();
        expect(fetchUserBookingsMock).toHaveBeenCalledTimes(1);
    });

    it('shows booking details when active bookings exist', async () => {
        mountComponent();
        await flushPromises();
        expect(wrapper.find('.booking-details').exists()).toBe(true);
    });

    it('selects first active booking after mount', async () => {
        mountComponent();
        await flushPromises();
        expect(wrapper.vm.selectedBooking.BookingID).toBe(101);
    });

    it('shows empty state when Active tab has no bookings', async () => {
        mountComponent({ active: [] });
        await flushPromises();
        expect(wrapper.text()).toContain(
            'Oops! You don’t have any active bookings.',
        );
    });

    it('shows empty state for Past tab when no bookings exist', async () => {
        mountComponent({ past: [] });
        await flushPromises();
        wrapper.vm.onTabChange('Past');
        await wrapper.vm.$nextTick();
        expect(wrapper.text()).toContain('No past bookings found.');
    });

    it('shows empty state for Request tab when no bookings exist', async () => {
        mountComponent({ request: [] });
        await flushPromises();
        wrapper.vm.onTabChange('Request');
        await wrapper.vm.$nextTick();
        expect(wrapper.text()).toContain('No booking requests submitted.');
    });

    it('updates URL when query is updated', async () => {
        mountComponent();
        await flushPromises();
        wrapper.vm.onQueryUpdate({ tab: 'Past', bookingId: 201 });
        expect(window.history.replaceState).toHaveBeenCalled();
    });

    it('final selected booking remains first active booking even if URL has bookingId', async () => {
        vi.spyOn(window, 'URLSearchParams').mockImplementation(() => ({
            get: (key) => {
                if (key === 'tab') return 'Past';
                if (key === 'bookingId') return '201';
                return null;
            },
        }));

        mountComponent();
        await flushPromises();
        expect(wrapper.vm.selectedBooking.BookingID).toBe(101);
    });

    it('clears selected booking when Active tab has no bookings', async () => {
        mountComponent({ active: [] });
        await flushPromises();
        expect(wrapper.vm.selectedBooking).toBe(null);
    });
});
