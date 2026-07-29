import { describe, it, expect, beforeEach, vi } from 'vitest';
import spotSearch from '@/store/spotSearch';
import { mayaClient } from '@/services/api';

vi.mock('@/services/api', () => ({
    mayaClient: {
        get: vi.fn(),
    },
}));

const { state, getters, mutations, actions } = spotSearch;

describe('SpotSearch Store - Complete Test Suite', () => {
    let commit;

    beforeEach(() => {
        state.sites = [];
        state.hasError = false;
        state.errorMessage = '';
        state.isLoading = false;

        commit = vi.fn((type, payload) => {
            mutations[type](state, payload);
        });

        vi.clearAllMocks();
    });

    it('state has required default structure', () => {
        expect(Array.isArray(state.sites)).toBe(true);
        expect(state.isLoading).toBe(false);
        expect(state.hasError).toBe(false);
        expect(state.errorMessage).toBe('');
    });

    it('getters return correct state properties', () => {
        state.sites = [{ SiteID: 1 }];
        state.isLoading = true;
        state.hasError = true;
        state.errorMessage = 'Test error';

        expect(getters.allSites(state)).toEqual([{ SiteID: 1 }]);
        expect(getters.isLoading(state)).toBe(true);
        expect(getters.hasError(state)).toBe(true);
        expect(getters.errorMessage(state)).toBe('Test error');
    });

    it('set-sites mutation sets sites', () => {
        mutations['set-sites'](state, [{ SiteID: 2 }]);
        expect(state.sites).toEqual([{ SiteID: 2 }]);
        expect(state.hasError).toBe(false);
    });

    it('set-error mutation updates error state', () => {
        mutations['set-error'](state, 'Sample Error');
        expect(state.hasError).toBe(true);
        expect(state.errorMessage).toBe('Sample Error');
    });

    it('set-loading mutation updates loading flag', () => {
        mutations['set-loading'](state, true);
        expect(state.isLoading).toBe(true);
        mutations['set-loading'](state, false);
        expect(state.isLoading).toBe(false);
    });

    it('fetchSites name search success flow', async () => {
        const mockSites = [
            { SiteID: 1, Name: 'Test Spot', Address: 'Test Address' },
        ];
        mayaClient.get.mockResolvedValue(mockSites);

        await actions.fetchSites(
            { commit, state },
            { query: 'test', searchType: 'name' },
        );
        expect(mayaClient.get).toHaveBeenCalledWith('/sites-by-name?name=test');
        expect(state.sites).toEqual(mockSites);
        expect(state.hasError).toBe(false);
    });

    it('fetchSites mobile search success flow', async () => {
        const mockResponse = {
            Sites: [
                { SiteID: 2, Name: 'Mobile Spot', Address: 'Mobile Address' },
            ],
            SpotRequests: [],
        };
        mayaClient.get.mockResolvedValue(mockResponse);

        await actions.fetchSites(
            { commit, state },
            { query: '99999 99999', searchType: 'mobile' },
        );
        expect(mayaClient.get).toHaveBeenCalledWith(
            '/sites-and-spot-requests?mobile=9999999999',
        );
        expect(state.sites).toEqual(mockResponse.Sites);
        expect(state.hasError).toBe(false);
    });

    it('fetchSites handles api error with ErrorCode', async () => {
        mayaClient.get.mockResolvedValue({
            ErrorCode: true,
            DisplayMsg: 'Error fetching',
        });

        await expect(
            actions.fetchSites(
                { commit, state },
                { query: 'test', searchType: 'name' },
            ),
        ).rejects.toThrow('Error fetching');
        expect(state.hasError).toBe(true);
        expect(state.errorMessage).toBe('Error fetching');
    });

    it('fetchSites handles network/rejected promises', async () => {
        const error = new Error('Network error');
        mayaClient.get.mockRejectedValue(error);

        await expect(
            actions.fetchSites(
                { commit, state },
                { query: 'test', searchType: 'name' },
            ),
        ).rejects.toThrow('Network error');
        expect(state.hasError).toBe(true);
        expect(state.errorMessage).toBe('Network error');
    });
});
