import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import BookingSidebar from '@/components/my-bookings/BookingSidebar.vue';

describe('BookingSidebar.vue', () => {
    let wrapper;

    const activeBookings = [
        {
            BookingID: 101,
            SiteDetails: {
                SiteName: 'Active Site',
                Address: 'Bangalore',
                SiteImageURI: 'active.jpg',
            },
        },
    ];

    const pastBookings = [
        {
            BookingID: 201,
            SiteDetails: {
                SiteName: 'Past Site',
                Address: 'Delhi',
                SiteImageURI: 'past.jpg',
            },
        },
    ];

    const requestBookings = [
        {
            BookingID: 301,
            SiteDetails: {
                SiteName: 'Request Site',
                Address: 'Mumbai',
                SiteImageURI: 'request.jpg',
            },
        },
    ];

    const mockURLParams = (params = {}) => {
        vi.spyOn(window, 'URLSearchParams').mockImplementation(() => ({
            get: (key) => params[key] ?? null,
        }));
    };

    const mountComponent = (props = {}) => {
        wrapper = mount(BookingSidebar, {
            props: {
                activebookings: activeBookings,
                pastbookings: pastBookings,
                requestbookings: requestBookings,
                selectedBooking: {},
                ...props,
            },
        });
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        wrapper?.unmount();
        vi.restoreAllMocks();
    });

    it('renders tabs', () => {
        mountComponent();
        const buttons = wrapper.findAll('.filter-buttons button');
        expect(buttons.length).toBe(3);
    });

    it('renders active bookings by default', () => {
        mountComponent();
        const cards = wrapper.findAll('.booking-card');
        expect(cards.length).toBe(1);
        expect(cards[0].text()).toContain('101');
    });

    it('changeTab emits update-query when no bookings exist', async () => {
        mountComponent({
            activebookings: [],
        });

        const activeTab = wrapper.findAll('.filter-buttons button')[1];
        await activeTab.trigger('click');
        const emits = wrapper.emitted('update-query');
        expect(emits).toBeTruthy();
        expect(emits[emits.length - 1][0]).toEqual({
            tab: 'Active',
            bookingId: null,
        });
    });

    it('emitQuery is called directly when selectCard is not triggered', async () => {
        mountComponent({
            requestbookings: [],
        });

        const requestTab = wrapper.findAll('.filter-buttons button')[2];
        await requestTab.trigger('click');
        const emits = wrapper.emitted('update-query');
        expect(emits).toBeTruthy();
        expect(emits[emits.length - 1][0].bookingId).toBe(null);
    });

    it('restoreFromUrl selects booking when bookingId matches', async () => {
        mockURLParams({ tab: 'Past', bookingId: '201' });
        mountComponent();
        await wrapper.vm.$nextTick();
        const emits = wrapper.emitted('select-booking');
        expect(emits[emits.length - 1][0].BookingID).toBe(201);
    });

    it('restoreFromUrl falls back when bookingId not found', async () => {
        mockURLParams({ tab: 'Request', bookingId: '999' });

        mountComponent();
        await wrapper.vm.$nextTick();
        const emits = wrapper.emitted('select-booking');
        expect(emits[emits.length - 1][0].BookingID).toBe(301);
    });

    it('restoreFromUrl emits tab-change when no booking exists', async () => {
        mockURLParams({ tab: 'Active' });

        mountComponent({
            activebookings: [],
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted('tab-change')).toBeTruthy();
    });

    it('watchers trigger restoreFromUrl on prop change', async () => {
        mockURLParams({});

        mountComponent();
        await wrapper.setProps({
            activebookings: [],
        });
        expect(wrapper.emitted('tab-change')).toBeTruthy();
    });
});
