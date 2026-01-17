import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createStore } from 'vuex';
import * as enums from '@/constant/enums';
import BookingDetails from '@/components/my-bookings/BookingDetails.vue';
import { BookingStatus } from '@/constant/enums';

describe('BookingDetails.vue', () => {
    let wrapper;
    let store;
    let fetchPaymentsMock;

    const bookingMock = {
        BookingID: 101,
        BookingStatus: BookingStatus.BookingConfirmed,
        VehicleNumber: 'UP14GU8447',
        StartTime: '10:00 AM',
        EndTime: '12:00 PM',
        RentCycle: '05-02-2026',
        Fee: {
            Rent: 100,
            ConvenienceFee: 10,
            SecurityDeposit: 500,
        },
        SiteDetails: {
            SiteID: 'SITE_1',
            SiteName: 'Test Site',
            Address: 'Bangalore',
            Latitude: 12.9716,
            Longitude: 77.5946,
        },
    };

    const mountComponent = ({
        payments = [],
        activeTab = 'Active',
        hasError = false,
        errorMessage = '',
    } = {}) => {
        fetchPaymentsMock = vi.fn();

        store = createStore({
            modules: {
                myBookings: {
                    namespaced: true,
                    state: () => ({
                        isLoading: false,
                        hasError,
                        errorMessage,
                        payments,
                    }),
                    actions: {
                        fetchPayments: fetchPaymentsMock,
                    },
                },
            },
        });

        wrapper = mount(BookingDetails, {
            props: {
                booking: bookingMock,
                activeTab,
            },
            global: {
                plugins: [store],
                stubs: {
                    MapContainer: true,
                    AtomTooltip: { template: '<div><slot /></div>' },
                    AtomIcon: true,
                    AtomButton: {
                        template:
                            '<button @click="$emit(`click`)"><slot /></button>',
                    },
                },
                mocks: {
                    $router: {
                        resolve: vi.fn(() => ({
                            href: '/spot-detail/SITE_1',
                        })),
                    },
                },
            },
        });
    };

    const openHistoryPopup = async () => {
        const btn = wrapper
            .findAll('button')
            .find((b) => b.text().includes('Show History'));

        expect(btn).toBeTruthy();

        await btn.trigger('click');
        await flushPromises();
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        wrapper?.unmount();
    });

    it('renders booking information correctly', () => {
        mountComponent();
        expect(wrapper.text()).toContain('Booking Information');
        expect(wrapper.text()).toContain('101');
        expect(wrapper.text()).toContain('UP14GU8447');
        expect(wrapper.text()).toContain('10:00 AM');
        expect(wrapper.text()).toContain('12:00 PM');
        expect(wrapper.text()).toContain('Test Site');
        expect(wrapper.text()).toContain('Bangalore');
    });

    it('dispatches fetchPayments when component is mounted', async () => {
        mountComponent();
        await flushPromises();
        expect(fetchPaymentsMock).toHaveBeenCalledTimes(1);
        expect(fetchPaymentsMock).toHaveBeenCalledWith(expect.any(Object), 101);
    });

    it('fetches payments again when booking id changes', async () => {
        mountComponent();

        await wrapper.setProps({
            booking: { ...bookingMock, BookingID: 202 },
        });

        expect(fetchPaymentsMock).toHaveBeenLastCalledWith(
            expect.any(Object),
            202,
        );
    });

    it('opens transaction popup on Show History click', async () => {
        mountComponent();
        expect(wrapper.find('.popup-overlay').exists()).toBe(false);
        await openHistoryPopup();
        expect(wrapper.find('.popup-overlay').exists()).toBe(true);
    });

    it('shows "Transaction not found" when no payments exist', async () => {
        mountComponent({ payments: [] });
        await openHistoryPopup();
        expect(wrapper.text()).toContain('Transaction not found');
    });

    it('renders transaction details when payments exist', async () => {
        const statusLabelSpy = vi
            .spyOn(enums, 'getBookingPaymentStatusLabel')
            .mockReturnValue('Success');

        mountComponent({
            payments: [
                {
                    bookingID: 101,
                    TransactionID: 'TXN123',
                    CreatedAt: '2026-01-01',
                    Amount: 610,
                    Status: 1,
                },
            ],
        });

        await openHistoryPopup();
        expect(wrapper.text()).toContain('TXN123');
        expect(wrapper.text()).toContain('610');
        expect(wrapper.text()).toContain('Success');
        expect(statusLabelSpy).toHaveBeenCalledWith(1);
    });

    it('renders table headers inside transaction popup', async () => {
        mountComponent();
        await openHistoryPopup();
        expect(wrapper.findAll('th').length).toBeGreaterThan(0);
    });

    it('does not show cancel button for Past tab', () => {
        mountComponent({ activeTab: 'Past' });
        expect(wrapper.find('.cancel-btn').exists()).toBe(false);
    });

    it('opens spot details when openSpotDetails is called', () => {
        mountComponent();
        const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
        wrapper.vm.openSpotDetails('SITE_1');
        expect(openSpy).toHaveBeenCalled();
        openSpy.mockRestore();
    });

    it('opens WhatsApp when cancelBooking is triggered', () => {
        mountComponent();
        const openSpy = vi.spyOn(window, 'open').mockReturnValue({});
        wrapper.vm.cancelBooking(bookingMock);
        expect(openSpy).toHaveBeenCalled();
        openSpy.mockRestore();
    });

    it('shows alert when WhatsApp window fails to open', () => {
        mountComponent();
        vi.spyOn(window, 'open').mockReturnValue(null);
        const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
        wrapper.vm.cancelBooking(bookingMock);
        expect(alertSpy).toHaveBeenCalled();
        alertSpy.mockRestore();
    });

    it('shows error message when hasError is true', async () => {
        mountComponent({
            hasError: true,
            errorMessage: 'Failed to load payments',
        });

        await openHistoryPopup();
        expect(wrapper.text()).toContain('Failed to load payments');
    });
});
