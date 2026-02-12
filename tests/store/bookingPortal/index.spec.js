import { describe, it, expect, beforeEach, vi } from 'vitest';
import bookingPortal from '@/store/bookingPortal';
import { mayaClient } from '@/services/api';

vi.mock('@/services/api', () => ({
    mayaClient: {
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
    },
}));

const { state: initialState, mutations, actions } = bookingPortal;

describe('BookingPortal Store', () => {
    let state;
    let commit;
    let dispatch;

    beforeEach(() => {
        state = JSON.parse(JSON.stringify(initialState));
        commit = vi.fn();
        dispatch = vi.fn();
        vi.clearAllMocks();
    });

    it('update-booking sets bookingDetails', () => {
        const payload = { Booking: { ID: 1 } };

        mutations['update-booking'](state, payload);

        expect(state.bookingDetails).toEqual(payload);
        expect(state.hasError).toBe(false);
    });

    it('set-error updates error state', () => {
        mutations['set-error'](state, 'Error');

        expect(state.status).toBe('error');
        expect(state.statusMessage).toBe('Error');
    });

    it('set-success updates success state', () => {
        mutations['set-success'](state, 'Success');

        expect(state.status).toBe('success');
        expect(state.statusMessage).toBe('Success');
    });

    it('set-agent-list filters names wrapped in []', () => {
        const agents = [{ FullName: 'Dev' }, { FullName: '[System User]' }];

        mutations['set-agent-list'](state, agents);

        expect(state.agents).toEqual([{ FullName: 'Dev' }]);
    });

    it('set-updated-fields stores updated fields', () => {
        mutations['set-updated-fields'](state, ['Rent']);
        expect(state.updatedFields).toEqual(['Rent']);
    });

    it('set-isField-updated toggles flag', () => {
        const prev = state.isFieldUpdated;
        mutations['set-isField-updated'](state, 'Updated');

        expect(state.isFieldUpdated).toBe(!prev);
        expect(state.successMessage).toBe('Updated');
    });

    it('getBookingDetails commits booking on success', async () => {
        mayaClient.get.mockResolvedValue({
            Booking: { ID: 101 },
        });

        await actions.getBookingDetails({ commit }, 101);

        expect(commit).toHaveBeenCalledWith('reset-global-status');
        expect(commit).toHaveBeenCalledWith('set-loading', true);
        expect(commit).toHaveBeenCalledWith('update-booking', {
            Booking: { ID: 101 },
        });
        expect(commit).toHaveBeenCalledWith(
            'set-initial-active-booking-details',
            { ID: 101 },
        );
        expect(commit).toHaveBeenLastCalledWith('set-loading', false);
    });

    it('getBookingDetails commits error on API error', async () => {
        mayaClient.get.mockResolvedValue({
            DisplayMsg: 'Failed',
            ErrorMsg: 'Not found',
        });

        await actions.getBookingDetails({ commit }, 101);

        expect(commit).toHaveBeenCalledWith(
            'set-error',
            'Failed ( Not found )',
        );
    });

    it('getPaymentLink sets payment details on success', async () => {
        mayaClient.post.mockResolvedValue({
            PayUrl: 'test-url',
        });

        await actions.getPaymentLink({ commit, dispatch }, { BookingID: 1 });

        expect(commit).toHaveBeenCalledWith('set-payment-details', {
            PayUrl: 'test-url',
        });

        expect(dispatch).toHaveBeenCalledWith('getBookingDetails', 1);
    });

    it('refreshPaymentStatus dispatches booking refresh', async () => {
        state.bookingDetails = { Booking: { ID: 10 } };

        mayaClient.get.mockResolvedValue({ Success: true });

        await actions.refreshPaymentStatus({ commit, dispatch, state }, 55);

        expect(dispatch).toHaveBeenCalledWith('getBookingDetails', 10);
    });

    it('updateBookingDetails resets updated fields on success', async () => {
        state.updatedFields = ['Rent'];

        mayaClient.post.mockResolvedValue({ Success: true });

        await actions.updateBookingDetails(
            { commit, dispatch, state },
            { ID: 5 },
        );

        expect(dispatch).toHaveBeenCalledWith('getBookingDetails', 5);
        expect(commit).toHaveBeenCalledWith('set-updated-fields', []);
    });

    it('changePaymentType commits success message', async () => {
        mayaClient.patch.mockResolvedValue({ Success: true });

        await actions.changePaymentType(
            { commit },
            { paymentID: 5, paymentType: 1 },
        );

        expect(commit).toHaveBeenCalledWith(
            'set-isField-updated',
            'Payment type update successfully!',
        );
    });

    it('createRefund commits success message', async () => {
        mayaClient.post.mockResolvedValue({ Success: true });

        await actions.createRefund({ commit }, { PaymentID: 5 });

        expect(commit).toHaveBeenCalledWith(
            'set-success',
            'Refund was initiated successfully',
        );
    });
});
