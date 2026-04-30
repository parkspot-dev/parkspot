import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import appModule from '@/store/app';
import { mayaClient } from '@/services/api';

vi.mock('@/services/api', () => ({
    mayaClient: {
        get: vi.fn(),
    },
}));

const CACHE_KEY = 'maya_agents_cache';
describe('App Store - Agents Module', () => {
    let state;
    let commit;

    beforeEach(() => {
        state = JSON.parse(JSON.stringify(appModule.state));
        commit = vi.fn();
        localStorage.clear();
        vi.clearAllMocks();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('has correct default state', () => {
        expect(state.agents).toEqual([]);
        expect(state.loading).toBe(false);
        expect(state.lastFetched).toBeNull();
    });

    it('set-agents sets agents correctly', () => {
        const agents = [{ FullName: 'Dev' }];
        appModule.mutations['set-agents'](state, agents);
        expect(state.agents).toEqual(agents);
    });

    it('getAgents fetches from API and stores cache correctly', async () => {
        const apiAgents = [{ FullName: 'Dev' }];
        mayaClient.get.mockResolvedValue(apiAgents);
        await appModule.actions.getAgents({ commit, state });
        expect(mayaClient.get).toHaveBeenCalledWith('/auth/user/agents');
        const cache = JSON.parse(localStorage.getItem(CACHE_KEY));
        expect(cache).toHaveProperty('data');
        expect(cache).toHaveProperty('timestamp');
        expect(commit).toHaveBeenCalledWith(
            'set-agents',
            expect.arrayContaining([{ FullName: 'Dev' }]),
        );
    });

    it('getAgents uses cache when valid', async () => {
        const cachedData = {
            data: [{ FullName: 'Cached Dev' }],
            timestamp: Date.now(),
        };

        localStorage.setItem(CACHE_KEY, JSON.stringify(cachedData));
        await appModule.actions.getAgents({ commit, state });
        expect(mayaClient.get).not.toHaveBeenCalled();
        expect(commit).toHaveBeenCalledWith('set-agents', cachedData.data);
    });

    it('getAgents calls API when cache is stale', async () => {
        const cachedData = {
            data: [{ FullName: 'Old Dev' }],
            timestamp: Date.now() - 10 * 60 * 1000,
        };

        localStorage.setItem(CACHE_KEY, JSON.stringify(cachedData));
        mayaClient.get.mockResolvedValue([{ FullName: 'New Dev' }]);
        await appModule.actions.getAgents({ commit, state });
        expect(mayaClient.get).toHaveBeenCalled();
    });

    it('getAgents falls back to cache on API failure', async () => {
        const cachedData = {
            data: [{ FullName: 'Cached Dev' }],
            timestamp: Date.now(),
        };

        localStorage.setItem(CACHE_KEY, JSON.stringify(cachedData));
        mayaClient.get.mockRejectedValue(new Error('Network error'));
        await appModule.actions.getAgents({ commit, state });
        expect(commit).toHaveBeenCalledWith('set-agents', cachedData.data);
    });

    it('getAgents throws error when no cache and API fails', async () => {
        mayaClient.get.mockRejectedValue(new Error('Network error'));
        await expect(
            appModule.actions.getAgents({ commit, state }),
        ).rejects.toThrow();
    });

    it('clearAgents removes cache and resets state', () => {
        localStorage.setItem(CACHE_KEY, JSON.stringify({}));
        appModule.actions.clearAgents({ commit });
        expect(localStorage.getItem(CACHE_KEY)).toBeNull();
        expect(commit).toHaveBeenCalledWith('set-agents', []);
        expect(commit).toHaveBeenCalledWith('set-last-fetched', null);
    });

    it('refreshAgents forces API call', async () => {
        const dispatch = vi.fn();
        await appModule.actions.refreshAgents({ dispatch });
        expect(dispatch).toHaveBeenCalledWith('getAgents', {
            forceRefresh: true,
        });
    });
});
