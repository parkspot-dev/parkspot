import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createStore } from 'vuex';
import TemplateBookingPortal from '@/components/templates/TemplateBookingPortal.vue';
import { PaymentStatus } from '@/constant/enums';

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

const paymentsMock = [
    {
        PaymentID: 1,
        Type: 0,
        Status: PaymentStatus.PaymentSuccess,
        Amount: 500,
        AmountToSo: 400,
        CreatedAt: '2024-01-01T00:00:00Z',
        SucceededAt: '2024-01-01T00:00:00Z',
        TransferredAt: '2024-01-01T00:00:00Z',
    },
];

const createVuexStore = (isAdmin = true) =>
    createStore({
        modules: {
            bookingPortal: {
                namespaced: true,
                state: () => ({
                    bookingDetails: bookingDetailsMock,
                    initialActiveBookingDetails: bookingDetailsMock.Booking,
                    agents: [
                        { UserName: 'agent1', FullName: 'Agent One' },
                        { UserName: 'agent2', FullName: 'Agent Two' },
                    ],
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
                    isAdmin,
                }),
                actions: {
                    getUserProfile: vi.fn(),
                },
            },
        },
    });

const factory = (isAdmin = true) => {
    const store = createVuexStore(isAdmin);
    const wrapper = mount(TemplateBookingPortal, {
        global: {
            plugins: [store],
            stubs: {
                AtomButton: {
                    template: `<button @click="$emit('click')"><slot /></button>`,
                },
                AtomIcon: {
                    template: `<span @click="$emit('click')"></span>`,
                },
                AtomTooltip: true,
                AtomDatePicker: true,
                AtomInput: { template: `<input />` },
                RefundDialog: true,
                SelectInput: {
                    name: 'SelectInput',
                    template: `<select></select>`,
                },
                RouterLink: true,
            },
            mocks: {
                $router: {
                    resolve: () => ({ href: '/spot/SITE123' }),
                },
                $buefy: {
                    toast: { open: vi.fn() },
                    dialog: { alert: vi.fn() },
                },
            },
        },
    });

    return { wrapper, store };
};

describe('TemplateBookingPortal.vue', () => {
    let wrapper;
    let store;

    beforeEach(() => {
        vi.clearAllMocks();
        global.navigator.clipboard = {
            writeText: vi.fn().mockResolvedValue(),
        };
        ({ wrapper, store } = factory(true));
    });

    afterEach(() => {
        delete global.navigator.clipboard;
        wrapper?.unmount();
    });

    it('renders component properly', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('renders booking ID and site ID', () => {
        expect(wrapper.text()).toContain('101');
        expect(wrapper.text()).toContain('SITE123');
    });

    it('emits payment-link event when getPaymentLink is called', () => {
        wrapper.vm.getPaymentLink();

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

    it('emits update-booking-details on save when data is changed', async () => {
        await wrapper.vm.enableEdit('Booking Details');
        wrapper.vm.currBookingDetails.Booking.Remark = 'Updated remark';
        await wrapper.vm.saveField();

        expect(wrapper.emitted('update-booking-details')).toBeTruthy();
        expect(wrapper.emitted('update-booking-details')[0][0].Remark).toBe(
            'Updated remark',
        );
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

    it('updates currBookingDetails when store bookingDetails changes', async () => {
        store.state.bookingPortal.bookingDetails = {
            ...bookingDetailsMock,
            Booking: {
                ...bookingDetailsMock.Booking,
                Remark: 'Updated',
            },
        };
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.currBookingDetails.Booking.Remark).toBe('Updated');
    });

    it('shows error dialog when status is error', async () => {
        store.state.bookingPortal.status = 'error';
        store.state.bookingPortal.statusMessage = 'Something went wrong';

        await wrapper.vm.$nextTick();

        expect(wrapper.vm.$buefy.dialog.alert).toHaveBeenCalled();
    });

    it('shows success dialog when status is success', async () => {
        store.state.bookingPortal.status = 'success';
        store.state.bookingPortal.statusMessage = 'Success';

        await wrapper.vm.$nextTick();

        expect(wrapper.vm.$buefy.dialog.alert).toHaveBeenCalled();
    });

    it('formats date correctly', () => {
        expect(wrapper.vm.getFormattedDate('2025-01-01T00:00:00Z')).toContain(
            '2025',
        );
    });

    it('returns -- for default invalid date', () => {
        expect(wrapper.vm.getFormattedDate('0001-01-01T00:00:00Z')).toBe('--');
    });

    it('returns correct payment class', () => {
        expect(wrapper.vm.getPaymentClass(PaymentStatus.PaymentPending)).toBe(
            'payment-pending',
        );
        expect(
            wrapper.vm.getPaymentClass(PaymentStatus.PaymentIncomplete),
        ).toBe('payment-pending');
        expect(wrapper.vm.getPaymentClass(PaymentStatus.PaymentSuccess)).toBe(
            'payment-success',
        );
        expect(wrapper.vm.getPaymentClass(999)).toBe('payment-failed');
    });

    it('resets data on cancelField', async () => {
        await wrapper.vm.enableEdit('Booking Details');
        wrapper.vm.currBookingDetails.Booking.Remark = 'Changed';

        wrapper.vm.cancelField();

        expect(wrapper.vm.editField).toBe(null);
        expect(wrapper.vm.currBookingDetails.Booking.Remark).toBe(
            bookingDetailsMock.Booking.Remark,
        );
    });

    it('dispatches changePaymentType with correct mapped payment type', () => {
        const spy = vi.spyOn(store, 'dispatch');

        const paymentTypeValue = 'UPI';
        const expectedIndex =
            wrapper.vm.paymentTypeLabels.indexOf(paymentTypeValue);

        wrapper.vm.updatePaymentType(paymentTypeValue, 55);

        expect(spy).toHaveBeenCalledWith('bookingPortal/changePaymentType', {
            paymentID: 55,
            paymentType: expectedIndex,
        });
    });

    it('does not show payment type SelectInput for non-admin user', async () => {
        ({ wrapper, store } = factory(false));

        store.state.bookingPortal.bookingDetails = {
            ...bookingDetailsMock,
            Payments: paymentsMock,
        };

        await wrapper.vm.$nextTick();
        expect(wrapper.findComponent({ name: 'SelectInput' }).exists()).toBe(
            false,
        );
        expect(wrapper.text()).toContain(
            wrapper.vm.getPaymentTypeLabel(paymentsMock[0].Type),
        );
    });

    it('copies payment url and updates tooltip label', async () => {
        store.state.bookingPortal.paymentDetails = {
            PayUrl: 'https://pay.test',
        };

        await wrapper.vm.copyUrl();

        expect(global.navigator.clipboard.writeText).toHaveBeenCalledWith(
            'https://pay.test',
        );
        expect(wrapper.vm.toolTipLabel).toBe('Copied!!');
    });

    it('emits refresh-payment-status event', () => {
        wrapper.vm.refreshPaymentStatus(123);

        expect(wrapper.emitted('refresh-payment-status')).toBeTruthy();
        expect(wrapper.emitted('refresh-payment-status')[0]).toEqual([123]);
    });

    it('clears validation errors when valid input is provided', () => {
        wrapper.vm.currBookingDetails.Booking.Rent = 0;
        wrapper.vm.validateRentInput();

        expect(wrapper.vm.rentValidationError).toBe(
            'Rent must be greater than zero',
        );

        wrapper.vm.currBookingDetails.Booking.Rent = 100;
        wrapper.vm.validateRentInput();

        expect(wrapper.vm.rentValidationError).toBe('');
    });

    it('validates SO charges input correctly', () => {
        wrapper.vm.currBookingDetails.Booking.Rent = 100;
        wrapper.vm.currBookingDetails.Booking.BaseAmount = 200;

        wrapper.vm.validateSOChargesInput();
        expect(wrapper.vm.soChargesValidationError).toBeTruthy();

        wrapper.vm.currBookingDetails.Booking.BaseAmount = 50;
        wrapper.vm.validateSOChargesInput();

        expect(wrapper.vm.soChargesValidationError).toBe('');
    });

    it('opens and closes refund dialog', () => {
        wrapper.vm.openRefundDialog(10, 500);

        expect(wrapper.vm.refundDialogVisible).toBe(true);
        expect(wrapper.vm.paymentID).toBe(10);
        expect(wrapper.vm.selectedPaymentAmount).toBe(500);

        wrapper.vm.closeRefundDialog();
        expect(wrapper.vm.refundDialogVisible).toBe(false);
    });

    it('dispatches createRefund on refund confirmation', () => {
        const spy = vi.spyOn(store, 'dispatch');

        wrapper.vm.paymentID = 99;
        wrapper.vm.handleRefundConfirm({
            refundAmount: '100.50',
            isSecurityDeposit: true,
        });

        expect(spy).toHaveBeenCalledWith('bookingPortal/createRefund', {
            PaymentID: 99,
            Amount: 100.5,
            IsRefundingSecurity: true,
        });
    });

    it('computed selectedAgent getter and setter work correctly', async () => {
        expect(wrapper.vm.selectedAgent).toBe(0);

        wrapper.vm.selectedAgent = 1;
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.currBookingDetails.Booking.AgentUserName).toBe(
            'agent2',
        );
        expect(wrapper.vm.selectedAgent).toBe(1);
    });

    it('renders KYC status as anchor link with correct mobile query and opens in new tab', async () => {
        await wrapper.vm.$nextTick();

        const kycLink = wrapper.find('a.kyc-link');

        expect(kycLink.exists()).toBe(true);
        expect(kycLink.attributes('href')).toBe(
            `https://www.parkspot.in/internal/users/kyc-status?mobile=${bookingDetailsMock.Booking.Mobile}`,
        );
        expect(kycLink.attributes('target')).toBe('_blank');
    });

    it('renders mobile number as anchor link to parking request search portal', async () => {
        await wrapper.vm.$nextTick();

        const mobileLink = wrapper.find('a.mobile-link');

        expect(mobileLink.exists()).toBe(true);
        expect(mobileLink.attributes('href')).toBe(
            `https://www.parkspot.in/internal/search-portal?tab=parking-request&mobile=${bookingDetailsMock.Booking.Mobile}`,
        );
        expect(mobileLink.attributes('target')).toBe('_blank');
    });
});
