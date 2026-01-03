import { describe, it, expect, beforeEach, vi } from 'vitest';
import searchPortal from '@/store/searchPortal';
import { mayaClient } from '@/services/api';

vi.mock('@/services/api', () => ({
    mayaClient: {
        get: vi.fn(),
    },
}));

const { state: initialState, mutations, actions } = searchPortal;

describe('SearchPortal Store', () => {
    let state;
    let commit;

    beforeEach(() => {
        state = JSON.parse(JSON.stringify(initialState));
        commit = vi.fn();
        vi.clearAllMocks();
    });

    it('has correct default state', () => {
        expect(state.loading).toBe(false);
        expect(state.hasError).toBe(false);
        expect(state.activeTab).toBe(0);
        expect(state.parkingRequests).toEqual([]);
        expect(state.filteredParkingRequests).toEqual([]);
    });

    it('set-loading toggles loading', () => {
        mutations['set-loading'](state);
        expect(state.loading).toBe(true);

        mutations['set-loading'](state);
        expect(state.loading).toBe(false);
    });

    it('update-active-tab updates tab index', () => {
        mutations['update-active-tab'](state, 2);
        expect(state.activeTab).toBe(2);
    });

    it('set-parking-requests sets parking and filtered lists', () => {
        const data = [{ id: 1 }];
        mutations['set-parking-requests'](state, data);
        expect(state.parkingRequests).toEqual(data);
        expect(state.filteredParkingRequests).toEqual(data);
    });

    it('set-error sets error state', () => {
        mutations['set-error'](state, 'Failed');
        expect(state.hasError).toBe(true);
        expect(state.errorMessage).toBe('Failed');
    });

    it('getAgents commits agent list', async () => {
        mayaClient.get.mockResolvedValue([
            { FullName: 'Dev Shrivastav' },
            { FullName: '[System User]' },
        ]);

        await actions.getAgents({ commit });
        expect(commit).toHaveBeenCalledWith('set-agent-list', [
            { FullName: 'Dev Shrivastav' },
            { FullName: '[System User]' },
        ]);
    });

    it('getParkingRequests commits data on success', async () => {
        mayaClient.get.mockResolvedValue({
            ParkingRequests: [{ id: 1 }],
            ExpiringRequestsCount: 3,
        });

        await actions.getParkingRequests({ state, commit });
        expect(commit).toHaveBeenCalledWith('set-loading', true);
        expect(commit).toHaveBeenCalledWith('set-parking-requests', [
            { id: 1 },
        ]);
        expect(commit).toHaveBeenCalledWith('set-expiring-requests-count', 3);
        expect(commit).toHaveBeenLastCalledWith('set-loading', false);
    });

    it('getParkingRequests commits error when api returns error', async () => {
        mayaClient.get.mockResolvedValue({
            ErrorCode: 400,
            DisplayMsg: 'Failed',
        });
        await actions.getParkingRequests({ state, commit });
        expect(commit).toHaveBeenCalledWith('set-error', 'Failed');
        expect(commit).toHaveBeenLastCalledWith('set-loading', false);
    });

    it('getParkingRequests commits error on rejected promise', async () => {
        mayaClient.get.mockRejectedValue(new Error('Network error'));
        await actions.getParkingRequests({ state, commit });
        expect(commit).toHaveBeenCalledWith('set-error', 'Network error');
        expect(commit).toHaveBeenLastCalledWith('set-loading', false);
    });

    it('extractExpiringRequests commits only expiring requests', () => {
        state.filteredParkingRequests = [
            { id: 1, IsExpiring: true },
            { id: 2, IsExpiring: false },
        ];

        actions.extractExpiringRequests({ state, commit });
        expect(commit).toHaveBeenCalledWith('set-filtered-parking-requests', [
            { id: 1, IsExpiring: true },
        ]);
    });

    it('extractRequestsByAgentName commits filtered agent requests', () => {
        state.filteredParkingRequests = [
            { id: 1, Agent: 'Dev' },
            { id: 2, Agent: 'Amit' },
        ];

        actions.extractRequestsByAgentName({ state, commit }, 'Dev');
        expect(commit).toHaveBeenCalledWith('set-filtered-parking-requests', [
            { id: 1, Agent: 'Dev' },
        ]);
    });

    it('extractRequestsByStatus commits filtered status requests', () => {
        state.filteredParkingRequests = [
            { id: 1, Status: 'OPEN' },
            { id: 2, Status: 'CLOSED' },
        ];

        actions.extractRequestsByStatus({ state, commit }, 'OPEN');
        expect(commit).toHaveBeenCalledWith('set-filtered-parking-requests', [
            { id: 1, Status: 'OPEN' },
        ]);
    });

    it('resetFilterParkingRequests resets filtered list', () => {
        state.parkingRequests = [{ id: 99 }];
        actions.resetFilterParkingRequests({ state, commit });
        expect(commit).toHaveBeenCalledWith('set-filtered-parking-requests', [
            { id: 99 },
        ]);
    });
});
