import { describe, it, expect, beforeEach, vi } from 'vitest';
import myBookings from '@/store/myBookings';
import { mayaClient } from '@/services/api';

vi.mock('@/services/api', () => ({
    mayaClient: {
        get: vi.fn(),
    },
}));

const { state, getters, mutations, actions } = myBookings;

describe('MyBookings Store - Complete Test Suite', () => {
    let commit;

    beforeEach(() => {
        state.activeBookings = [];
        state.pastBookings = [];
        state.requestedBookings = [];
        state.payments = [];
        state.cachePayments = {};
        state.hasError = false;
        state.errorMessage = '';
        state.isLoading = false;
        state.searchDate = '';

        commit = vi.fn((type, payload) => {
            mutations[type](state, payload);
        });

        vi.clearAllMocks();
    });

    it('state has required default structure', () => {
        expect(Array.isArray(state.activeBookings)).toBe(true);
        expect(Array.isArray(state.pastBookings)).toBe(true);
        expect(Array.isArray(state.requestedBookings)).toBe(true);
        expect(Array.isArray(state.payments)).toBe(true);
        expect(typeof state.cachePayments).toBe('object');
    });

    it('allBookings getter returns grouped bookings', () => {
        state.activeBookings = [{ id: 1 }];
        state.pastBookings = [{ id: 2 }];
        state.requestedBookings = [{ id: 3 }];

        const result = getters.allBookings(state);

        expect(result).toEqual({
            active: [{ id: 1 }],
            past: [{ id: 2 }],
            requested: [{ id: 3 }],
        });
    });

    it('set-requests mutation sets booking lists', () => {
        mutations['set-requests'](state, {
            ActiveBookings: [{ id: 1 }],
            PastBookings: [{ id: 2 }],
            RequestedBookings: [{ id: 3 }],
        });

        expect(state.activeBookings.length).toBe(1);
        expect(state.pastBookings.length).toBe(1);
        expect(state.requestedBookings.length).toBe(1);
    });

    it('set-error mutation updates error state', () => {
        mutations['set-error'](state, 'Error');
        expect(state.hasError).toBe(true);
        expect(state.errorMessage).toBe('Error');
    });

    it('set-loading mutation toggles loading flag', () => {
        mutations['set-loading'](state, true);
        expect(state.isLoading).toBe(true);
        mutations['set-loading'](state, false);
        expect(state.isLoading).toBe(false);
    });

    it('set-search-date mutation updates searchDate', () => {
        mutations['set-search-date'](state, '2024-01-01');
        expect(state.searchDate).toBe('2024-01-01');
    });

    it('set-payments mutation sets payments', () => {
        mutations['set-payments'](state, [{ id: 10 }]);
        expect(state.payments).toEqual([{ id: 10 }]);
    });

    it('set-cache-payment mutation caches payments', () => {
        mutations['set-cache-payment'](state, {
            bookingID: 'B1',
            payments: [{ id: 20 }],
        });

        expect(state.cachePayments.B1).toEqual([{ id: 20 }]);
    });

    it('fetchUserBookings success flow', async () => {
        mayaClient.get.mockResolvedValue({
            ActiveBookings: [{ id: 1, SiteDetails: {} }],
            PastBookings: [{ id: 2, SiteDetails: {} }],
            RequestedBookings: [{ id: 3, SiteDetails: {} }],
        });

        await actions.fetchUserBookings({ commit });
        expect(state.activeBookings.length).toBe(1);
        expect(state.pastBookings.length).toBe(1);
        expect(state.requestedBookings.length).toBe(1);
        expect(state.hasError).toBe(false);
    });

    it('fetchUserBookings handles api error', async () => {
        mayaClient.get.mockResolvedValue({
            ErrorCode: true,
            DisplayMsg: 'API failed',
        });

        await actions.fetchUserBookings({ commit });
        expect(state.hasError).toBe(true);
        expect(state.errorMessage).toBe('API failed');
    });

    it('fetchPayments uses cache when available', async () => {
        state.cachePayments.B1 = [{ id: 30 }];
        await actions.fetchPayments({ commit }, 'B1');
        expect(state.payments).toEqual([{ id: 30 }]);
    });

    it('fetchPayments success flow', async () => {
        mayaClient.get.mockResolvedValue({
            Payments: [{ id: 40 }],
        });

        await actions.fetchPayments({ commit }, 'B2');
        expect(state.payments).toEqual([{ id: 40 }]);
        expect(state.cachePayments.B2).toEqual([{ id: 40 }]);
    });

    it('fetchPayments handles api error', async () => {
        mayaClient.get.mockResolvedValue({
            ErrorCode: true,
            DisplayMsg: 'Payment error',
        });

        await actions.fetchPayments({ commit }, 'B3');
        expect(state.hasError).toBe(true);
        expect(state.errorMessage).toBe('Payment error');
    });
});
