import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createStore } from 'vuex';
import BookingPortal from '@/views/BookingPortal.vue';

describe('BookingPortal.vue', () => {
    let wrapper;
    let store;
    let actionsMock;
    let alertMock;
    let routerPushMock;

    const createVuexStore = (initialState = {}) => {
        actionsMock = {
            getBookingDetails: vi.fn(),
            getPaymentLink: vi.fn(),
            getActiveBooking: vi.fn(),
            getUpcomingBooking: vi.fn(),
            getBookingsByStatus: vi.fn().mockResolvedValue(),
            updateBookingDetails: vi.fn(),
            refreshPaymentStatus: vi.fn(),
            getAgents: vi.fn(),
            updateSearchText: vi.fn(),
            resetBookingDetails: vi.fn(),
        };

        return createStore({
            modules: {
                bookingPortal: {
                    namespaced: true,
                    state: () => ({
                        hasError: false,
                        errorMessage: '',
                        isLoading: false,
                        bookingDetails: null,
                        activeBookings: [],
                        activeBookingType: 'active',
                        searchText: '',
                        ...initialState,
                    }),
                    actions: actionsMock,
                },
            },
        });
    };

    const mountComponent = ({
        routeQuery = {},
        routePath = '/booking-portal',
        storeState = {},
    } = {}) => {
        store = createVuexStore(storeState);
        alertMock = vi.fn();
        routerPushMock = vi.fn();

        wrapper = mount(BookingPortal, {
            global: {
                plugins: [store],
                mocks: {
                    $route: {
                        query: routeQuery,
                        path: routePath,
                    },
                    $router: {
                        push: routerPushMock,
                    },
                    $buefy: {
                        dialog: {
                            alert: alertMock,
                        },
                    },
                },
                stubs: {
                    MoleculeSearchBox: {
                        name: 'MoleculeSearchBox',
                        props: ['placeholder', 'initialValue'],
                        template: '<div class="search-box"></div>',
                    },
                    TemplateBookingPortal: {
                        name: 'TemplateBookingPortal',
                        template: '<div class="template-booking-portal"></div>',
                    },
                    ActiveBookings: {
                        name: 'ActiveBookings',
                        props: ['activeBookings', 'bookingType'],
                        template: '<div class="active-bookings"></div>',
                    },
                    LoaderModal: {
                        name: 'LoaderModal',
                        template: '<div class="loader-modal"></div>',
                    },
                },
            },
        });
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        wrapper?.unmount();
    });

    it('renders search box, loader modal, and template/active bookings based on state', () => {
        mountComponent({
            storeState: {
                searchText: 'BK123',
                isLoading: true,
                bookingDetails: { Booking: { ID: 101 } },
            },
        });

        const searchBox = wrapper.findComponent({ name: 'MoleculeSearchBox' });
        expect(searchBox.exists()).toBe(true);
        expect(searchBox.props('initialValue')).toBe('BK123');
        expect(wrapper.find('.loader-modal').exists()).toBe(true);
        expect(wrapper.find('.template-booking-portal').exists()).toBe(true);
        expect(wrapper.find('.active-bookings').exists()).toBe(false);
    });

    it('renders ActiveBookings when bookingDetails is null', () => {
        const bookings = [{ ID: 1 }];
        mountComponent({
            storeState: {
                bookingDetails: null,
                activeBookings: bookings,
                activeBookingType: 'upcoming',
            },
        });

        const activeBookingsComp = wrapper.findComponent({
            name: 'ActiveBookings',
        });
        expect(activeBookingsComp.exists()).toBe(true);
        expect(activeBookingsComp.props('activeBookings')).toEqual(bookings);
        expect(activeBookingsComp.props('bookingType')).toBe('upcoming');
    });

    it('fetches booking details on mount when bookingId query param is present', async () => {
        mountComponent({ routeQuery: { bookingId: 'BK-555' } });
        await flushPromises();

        expect(actionsMock.updateSearchText).toHaveBeenCalledWith(
            expect.anything(),
            'BK-555',
        );
        expect(actionsMock.getAgents).toHaveBeenCalled();
        expect(actionsMock.getBookingDetails).toHaveBeenCalledWith(
            expect.anything(),
            'BK-555',
        );
        expect(actionsMock.getBookingsByStatus).not.toHaveBeenCalled();
    });

    it('fetches bookings by status on mount when bookingId query param is absent', async () => {
        mountComponent({ routeQuery: { status: 'upcoming' } });
        await flushPromises();

        expect(actionsMock.updateSearchText).toHaveBeenCalledWith(
            expect.anything(),
            '',
        );
        expect(actionsMock.resetBookingDetails).toHaveBeenCalled();
        expect(actionsMock.getBookingsByStatus).toHaveBeenCalledWith(
            expect.anything(),
            'upcoming',
        );
    });

    it('triggers alertError on watcher and method execution', () => {
        mountComponent({
            storeState: { errorMessage: 'Something went wrong' },
        });

        wrapper.vm.$options.watch.hasError.call(wrapper.vm, true);
        expect(alertMock).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'Something went wrong' }),
        );

        alertMock.mockClear();
        wrapper.vm.alertError('Custom error');
        expect(alertMock).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'Custom error' }),
        );
    });

    it('onBookingTypeChange updates router query to upcoming', () => {
        mountComponent({
            routePath: '/booking-portal',
            routeQuery: { foo: 'bar' },
            storeState: { activeBookingType: 'active' },
        });

        wrapper.vm.onBookingTypeChange('upcoming');

        expect(routerPushMock).toHaveBeenCalledWith({
            path: '/booking-portal',
            query: { foo: 'bar', status: 'upcoming' },
        });
    });

    it('onBookingTypeChange removes status query when switching to active', () => {
        mountComponent({
            routePath: '/booking-portal',
            routeQuery: { status: 'upcoming', foo: 'bar' },
            storeState: { activeBookingType: 'upcoming' },
        });

        wrapper.vm.onBookingTypeChange('active');

        expect(routerPushMock).toHaveBeenCalledWith({
            path: '/booking-portal',
            query: { foo: 'bar' },
        });
    });

    it('searchBooking resets state, updates search text, navigates, and fetches details', () => {
        mountComponent({ routePath: '/booking-portal' });

        wrapper.vm.searchBooking('BK-999');

        expect(actionsMock.resetBookingDetails).toHaveBeenCalled();
        expect(actionsMock.updateSearchText).toHaveBeenCalledWith(
            expect.anything(),
            'BK-999',
        );
        expect(routerPushMock).toHaveBeenCalledWith({
            path: '/booking-portal',
            query: { bookingId: 'BK-999' },
        });
        expect(actionsMock.getBookingDetails).toHaveBeenCalledWith(
            expect.anything(),
            'BK-999',
        );
    });

    it('onClearInput resets input and updates route when bookingId is present', async () => {
        mountComponent({
            routeQuery: { bookingId: 'BK-100', status: 'upcoming' },
        });

        await wrapper.vm.onClearInput();

        expect(actionsMock.updateSearchText).toHaveBeenCalledWith(
            expect.anything(),
            '',
        );
        expect(actionsMock.resetBookingDetails).toHaveBeenCalled();
        expect(routerPushMock).toHaveBeenCalledWith({
            name: 'booking-portal',
            query: { status: 'upcoming' },
        });
    });

    it('handles child component emitted events', () => {
        mountComponent({
            storeState: { bookingDetails: { Booking: { ID: 1 } } },
        });

        const templateComp = wrapper.findComponent({
            name: 'TemplateBookingPortal',
        });
        templateComp.vm.$emit('payment-link', { req: 1 });
        expect(actionsMock.getPaymentLink).toHaveBeenCalledWith(
            expect.anything(),
            { req: 1 },
        );

        templateComp.vm.$emit('refresh-payment-status', 123);
        expect(actionsMock.refreshPaymentStatus).toHaveBeenCalledWith(
            expect.anything(),
            123,
        );

        templateComp.vm.$emit('update-booking-details', { update: true });
        expect(actionsMock.updateBookingDetails).toHaveBeenCalledWith(
            expect.anything(),
            { update: true },
        );
    });
});
