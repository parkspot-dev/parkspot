import { describe, it, expect, beforeEach, vi } from 'vitest';
import searchPortal from '@/store/searchPortal';
import { mayaClient } from '@/services/api';

vi.mock('@/services/api', () => ({
    mayaClient: {
        get: vi.fn(),
    },
}));

const { state: initialState, mutations, actions } = searchPortal;

const createState = (overrides = {}) => ({
    ...JSON.parse(JSON.stringify(initialState)),
    ...overrides,
});

describe('SearchPortal Store', () => {
    let commit;
    let dispatch;

    beforeEach(() => {
        vi.clearAllMocks();

        commit = vi.fn();
        dispatch = vi.fn();
    });

    it('has the correct default state', () => {
        const state = createState();

        expect(state).toEqual({
            loading: false,
            hasError: false,
            errorMessage: '',
            activeTab: 0,
            SOLatLngInput: '',
            searchMobile: '',
            agentList: [],
            parkingRequests: [],
            interestedVOList: [],
            filteredParkingRequests: [],
            expiringRequestsCount: 0,
        });
    });

    it('updates loading when setLoading mutation runs', () => {
        const state = createState();

        mutations.setLoading(state, true);

        expect(state.loading).toBe(true);
    });

    it('updates the active tab when updateActiveTab mutation runs', () => {
        const state = createState();

        mutations.updateActiveTab(state, 2);

        expect(state.activeTab).toBe(2);
    });

    it('sets parking requests and filtered parking requests together', () => {
        const state = createState();
        const requests = [{ id: 1 }];

        mutations.setParkingRequests(state, requests);

        expect(state.parkingRequests).toEqual([{ id: 1 }]);
        expect(state.filteredParkingRequests).toEqual([{ id: 1 }]);
    });

    it('updates the interested vo list', () => {
        const state = createState();
        const requests = [{ id: 9 }];

        mutations.setInterestedVOList(state, requests);

        expect(state.interestedVOList).toEqual([{ id: 9 }]);
    });

    it('updates the search lat lng input', () => {
        const state = createState();

        mutations.updateSOLatLngInput(state, '12.3,77.4');

        expect(state.SOLatLngInput).toBe('12.3,77.4');
    });

    it('creates a unique agent list and appends the NA option', () => {
        const state = createState();
        const agents = [
            { FullName: 'Dev Shrivastav' },
            { FullName: 'Amit Kumar' },
            { FullName: 'Dev Mehta' },
            { FullName: '[System User]' },
        ];

        mutations.setAgentList(state, agents);

        expect(state.agentList).toEqual([
            { id: 'Dev', name: 'Dev' },
            { id: 'Amit', name: 'Amit' },
            { id: 'NA', name: 'NA' },
        ]);
    });

    it('does not duplicate the NA option when it already exists', () => {
        const state = createState();

        mutations.setAgentList(state, [{ FullName: 'NA Sharma' }]);

        expect(state.agentList).toEqual([{ id: 'NA', name: 'NA' }]);
    });

    it('sets the error state when a message is present', () => {
        const state = createState();

        mutations.setError(state, 'Failed');

        expect(state.hasError).toBe(true);
        expect(state.errorMessage).toBe('Failed');
    });

    it('clears the error state when the message is empty', () => {
        const state = createState();

        mutations.setError(state, '');

        expect(state.hasError).toBe(false);
        expect(state.errorMessage).toBe('');
    });

    it('updates the search mobile value', () => {
        const state = createState();

        mutations.setSearchMobile(state, '9876543210');

        expect(state.searchMobile).toBe('9876543210');
    });

    it('updates the expiring requests count', () => {
        const state = createState();

        mutations.setExpiringRequestsCount(state, 3);

        expect(state.expiringRequestsCount).toBe(3);
    });

    it('updates the filtered parking requests list', () => {
        const state = createState();
        const requests = [{ id: 88 }];

        mutations.setFilteredParkingRequests(state, requests);

        expect(state.filteredParkingRequests).toEqual([{ id: 88 }]);
    });

    it('commits the active tab update action payload', () => {
        actions.updateActiveTab({ commit }, 1);

        expect(commit).toHaveBeenCalledWith('updateActiveTab', 1);
    });

    it('dispatches app getAgents and then commits the root agents when none are cached', async () => {
        const rootState = {
            app: { agents: [] },
        };

        dispatch.mockImplementation(async () => {
            rootState.app.agents = [{ FullName: 'Dev Shrivastav' }];
        });

        await actions.getAgents({ commit, rootState, dispatch });

        expect(dispatch).toHaveBeenCalledWith('app/getAgents', null, {
            root: true,
        });
        expect(commit).toHaveBeenCalledWith(
            'setAgentList',
            expect.arrayContaining([
                expect.objectContaining({ FullName: 'Dev Shrivastav' }),
            ]),
        );
    });

    it('uses cached root agents without dispatching another fetch', async () => {
        const rootState = {
            app: { agents: [{ FullName: 'Amit Kumar' }] },
        };

        await actions.getAgents({ commit, rootState, dispatch });

        expect(dispatch).not.toHaveBeenCalled();
        expect(commit).toHaveBeenCalledWith(
            'setAgentList',
            expect.arrayContaining([
                expect.objectContaining({ FullName: 'Amit Kumar' }),
            ]),
        );
    });

    it('commits parking requests and expiring count when getParkingRequests succeeds', async () => {
        const state = createState();

        mayaClient.get.mockResolvedValue({
            ParkingRequests: [{ id: 1 }],
            ExpiringRequestsCount: 3,
        });

        await actions.getParkingRequests({ state, commit });

        expect(mayaClient.get).toHaveBeenCalledWith('/internal/parking-requests');
        expect(commit).toHaveBeenCalledWith('setLoading', true);
        expect(commit).toHaveBeenCalledWith(
            'setParkingRequests',
            expect.arrayContaining([expect.objectContaining({ id: 1 })]),
        );
        expect(commit).toHaveBeenCalledWith(
            'setInterestedVOList',
            expect.arrayContaining([expect.objectContaining({ id: 1 })]),
        );
        expect(commit).toHaveBeenCalledWith('setExpiringRequestsCount', 3);
        expect(commit).toHaveBeenLastCalledWith('setLoading', false);
    });

    it('does not call the api when getParkingRequests starts while loading is true', async () => {
        const state = createState({ loading: true });

        await actions.getParkingRequests({ state, commit });

        expect(mayaClient.get).not.toHaveBeenCalled();
        expect(commit).not.toHaveBeenCalled();
    });

    it('sanitizes the mobile number before requesting parking requests', async () => {
        const state = createState({ searchMobile: '98 76 54 3210' });

        mayaClient.get.mockResolvedValue({
            ParkingRequests: [],
        });

        await actions.getParkingRequests({ state, commit });

        expect(mayaClient.get).toHaveBeenCalledWith(
            '/internal/parking-requests?mobile=9876543210',
        );
    });

    it('commits an error message when getParkingRequests receives an api error response', async () => {
        const state = createState();

        mayaClient.get.mockResolvedValue({
            ErrorCode: 400,
            DisplayMsg: 'Failed',
        });

        await actions.getParkingRequests({ state, commit });

        expect(commit).toHaveBeenCalledWith('setError', 'Failed');
        expect(commit).toHaveBeenLastCalledWith('setLoading', false);
    });

    it('commits an error message when getParkingRequests rejects', async () => {
        const state = createState();

        mayaClient.get.mockRejectedValue(new Error('Network error'));

        await actions.getParkingRequests({ state, commit });

        expect(commit).toHaveBeenCalledWith('setError', 'Network error');
        expect(commit).toHaveBeenLastCalledWith('setLoading', false);
    });

    it('commits interested vo results when getInterestedVO succeeds', async () => {
        mayaClient.get.mockResolvedValue({
            ParkingRequests: [{ id: 5 }],
        });

        await actions.getInterestedVO({ commit }, ' 12.98 , 77.59 ');

        expect(mayaClient.get).toHaveBeenCalledWith(
            '/search-requests?lat=12.98&long=77.59',
        );
        expect(commit).toHaveBeenCalledWith('setLoading', true);
        expect(commit).toHaveBeenCalledWith(
            'setInterestedVOList',
            expect.arrayContaining([expect.objectContaining({ id: 5 })]),
        );
        expect(commit).toHaveBeenCalledWith(
            'setParkingRequests',
            expect.arrayContaining([expect.objectContaining({ id: 5 })]),
        );
        expect(commit).toHaveBeenLastCalledWith('setLoading', false);
    });

    it('commits an error when getInterestedVO receives an api error response', async () => {
        mayaClient.get.mockResolvedValue({
            ErrorCode: 400,
            DisplayMsg: 'Invalid coordinates',
        });

        await actions.getInterestedVO({ commit }, '12.1,77.1');

        expect(commit).toHaveBeenCalledWith('setError', 'Invalid coordinates');
        expect(commit).toHaveBeenLastCalledWith('setLoading', false);
    });

    it('clears the error via resetError action', () => {
        actions.resetError({ commit });

        expect(commit).toHaveBeenCalledWith('setError', '');
    });

    it('commits the mobile input payload via updateMobileInput', () => {
        actions.updateMobileInput({ commit }, '9999999999');

        expect(commit).toHaveBeenCalledWith('setSearchMobile', '9999999999');
    });

    it('commits the lat lng payload via updateSOLatLngInput', () => {
        actions.updateSOLatLngInput({ commit }, '10.1,11.2');

        expect(commit).toHaveBeenCalledWith('updateSOLatLngInput', '10.1,11.2');
    });

    it('commits the provided agent list via setAgents', () => {
        const agents = [{ FullName: 'Dev Shrivastav' }];

        actions.setAgents({ commit }, agents);

        expect(commit).toHaveBeenCalledWith(
            'setAgentList',
            expect.arrayContaining([
                expect.objectContaining({ FullName: 'Dev Shrivastav' }),
            ]),
        );
    });

    it('returns all parking requests when applyParkingRequestFilters receives empty filters', () => {
        const state = createState({
            parkingRequests: [
                { id: 1, IsExpiring: true, Status: 1, Agent: 'Dev' },
                { id: 2, IsExpiring: false, Status: 2, Agent: 'Amit' },
            ],
        });

        actions.applyParkingRequestFilters({ commit, state }, {});

        expect(commit).toHaveBeenCalledWith('setFilteredParkingRequests', [
            { id: 1, IsExpiring: true, Status: 1, Agent: 'Dev' },
            { id: 2, IsExpiring: false, Status: 2, Agent: 'Amit' },
        ]);
    });

    it('filters parking requests by expiring status and agent name', () => {
        const state = createState({
            parkingRequests: [
                { id: 1, IsExpiring: true, Status: 1, Agent: 'Dev' },
                { id: 2, IsExpiring: false, Status: 1, Agent: 'Dev' },
                { id: 3, IsExpiring: true, Status: 2, Agent: 'Dev' },
                { id: 4, IsExpiring: true, Status: 1, Agent: 'Amit' },
            ],
        });

        actions.applyParkingRequestFilters(
            { commit, state },
            {
                isExpiring: true,
                status: 1,
                agentName: 'Dev',
            },
        );

        expect(commit).toHaveBeenCalledWith('setFilteredParkingRequests', [
            { id: 1, IsExpiring: true, Status: 1, Agent: 'Dev' },
        ]);
    });
});
