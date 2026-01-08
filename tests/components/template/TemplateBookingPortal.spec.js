import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach,afterEach, vi } from "vitest";
import { createStore } from "vuex";
import TemplateBookingPortal from "@/components/templates/TemplateBookingPortal.vue";

const bookingDetailsMock = {
    Booking: {
        ID: 101,
        SiteID: 'SITE123',
        Status: 1,
        Remark: 'Test remark',
        CreatedAt: '2024-01-01T00:00:00Z',
        StartTime: '2024-01-02T00:00:00Z',
        EndTime: '2024-01-03T00:00:00Z',
        Rent: 1000,
        BaseAmount: 500,
        PaymentPeriod: 0,
        ConvenienceFee: 50,
        SecurityDeposit: 1000,
        RentCycle: 30,
        AgentUserName: 'agent1',
        UserName: 'user1',
        Name: 'Test User',
        Mobile: '1234567890',
        EmailID: 'test@example.com',
        VehicleNumber: 'OB123CD',
        VOKYCStatus: 1,
    },
    Payments: [],
};


const createVuexStore = () =>
    createStore({
        modules: {
            bookingPortal: {
                namespaced: true,
                state: () => ({
                    bookingDetails: bookingDetailsMock,
                    initialActiveBookingDetails: bookingDetailsMock.Booking,
                    agents: [],
                    paymentDetails: null,
                    status: '',
                    statusMessage: '',
                    successMessage: '',
                }),
                actions: {
                    setUpdatedFields: vi.fn(),
                    createRefund: vi.fn(),
                    changePaymentType: vi.fn(),
                },
                mutations: {
                    'set-isField-updated': vi.fn(),
                },
            },
            user: {
                namespaced: true,
                state: () => ({
                    isAdmin: true,
                }),
                actions: {
                    getUserProfile: vi.fn(),
                },
            },
        },
    });


const globalConfig = (store) => ({
    global: {
        plugins: [store],
        stubs: {
            AtomButton: {
                template: `<button @click="$emit('click')"><slot /></button>`,
            },
            AtomIcon: {
                template: `<span class="icon" @click="$emit('click')"></span>`,
            },
            AtomTooltip: true,
            AtomDatePicker: true,
            AtomInput: {
                template: `<input />`,
            },
            RefundDialog: true,
            SelectInput: true,
            RouterLink: true,
        },
        mocks: {
            $router: {
                resolve: () => ({href: '/spot/SITE123'}),
            },
            $buefy: {
                toast: {open: vi.fn()},
                dialog: {alert: vi.fn()},
            },
        },
    },
});

let store;
let wrapper;

const factory = () => {
    store = createVuexStore();
    wrapper = mount(TemplateBookingPortal, globalConfig(store));
    return wrapper;
};

describe('TemplateBookingPortal.vue', () => {

    beforeEach(() => {
        factory();
    });

    afterEach(() => {
        wrapper?.unmount();
        vi.clearAllMocks();
    });

    it('renders component properly', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('renders booking ID and site ID', () => {
        expect(wrapper.text()).toContain('101');
        expect(wrapper.text()).toContain('SITE123');
    });

    it('emits payment-link event when generate payment link button is clicked', async () => {
        const button = wrapper.find('button');
        await button.trigger('click');

        expect(wrapper.emitted('payment-link')).toBeTruthy();
        expect(wrapper.emitted('payment-link')[0][0]).toEqual({
            BookingID: '101',
            Discount: 0.0,
            Promocode: '',
        });
    });

    it('enters edit mode for Booking Details', async () => {
        await wrapper.vm.enableEdit('Booking Details');
        expect(wrapper.vm.editField).toBe('Booking Details');
    });

    it('emits update-booking-details on save', async () => {
        await wrapper.vm.enableEdit('Booking Details');
        await wrapper.vm.saveField();

        expect(wrapper.emitted('update-booking-details')).toBeTruthy();
        expect(wrapper.emitted('update-booking-details')[0][0]).toEqual(bookingDetailsMock.Booking);
    });

    it('shows validation error when rent is invalid', async () => {
        wrapper.vm.currBookingDetails.Booking.Rent = 0;

        await wrapper.vm.enableEdit('Rent Details');
        await wrapper.vm.saveField();

        expect(wrapper.vm.rentValidationError).toBeTruthy();
    });

    it('does not emit update-booking-details if rent validation fails', async () => {
        wrapper.vm.currBookingDetails.Booking.Rent = 0;

        await wrapper.vm.enableEdit('Rent Details');
        await wrapper.vm.saveField();

        expect(wrapper.emitted('update-booking-details')).toBeFalsy();
    });
});
