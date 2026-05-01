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

    it('set-agents mutation sets agents correctly', () => {
        const agents = [{ FullName: 'Dev' }];
        appModule.mutations['set-agents'](state, agents);
        expect(state.agents).toEqual(agents);
    });

    it('set-loading mutation sets loading correctly', () => {
        appModule.mutations['set-loading'](state, true);
        expect(state.loading).toBe(true);
    });

    it('set-last-fetched mutation sets timestamp correctly', () => {
        const now = Date.now();
        appModule.mutations['set-last-fetched'](state, now);
        expect(state.lastFetched).toBe(now);
    });

    it('getAgents fetches from API and updates cache when no cache exists', async () => {
        const apiAgents = [{ FullName: 'Dev' }];
        mayaClient.get.mockResolvedValue(apiAgents);
        await appModule.actions.getAgents({ commit, state });
        expect(commit).toHaveBeenCalledWith('set-loading', true);
        expect(mayaClient.get).toHaveBeenCalledWith('/auth/user/agents');

        const cache = JSON.parse(localStorage.getItem(CACHE_KEY));
        expect(cache).toHaveProperty('data');
        expect(cache).toHaveProperty('timestamp');
        expect(cache.data).toEqual(expect.arrayContaining(apiAgents));

        expect(commit).toHaveBeenCalledWith(
            'set-agents',
            expect.arrayContaining(apiAgents),
        );

        expect(commit).toHaveBeenCalledWith(
            'set-last-fetched',
            expect.any(Number),
        );

        expect(commit).toHaveBeenCalledWith('set-loading', false);
    });

    it('getAgents uses valid cache and skips API call', async () => {
        const cachedData = {
            data: [{ FullName: 'Cached Dev' }],
            timestamp: Date.now(),
        };

        localStorage.setItem(CACHE_KEY, JSON.stringify(cachedData));
        await appModule.actions.getAgents({ commit, state });
        expect(mayaClient.get).not.toHaveBeenCalled();
        expect(commit).toHaveBeenCalledWith('set-agents', cachedData.data);
        expect(commit).toHaveBeenCalledWith(
            'set-last-fetched',
            cachedData.timestamp,
        );
    });

    it('getAgents calls API if cache is stale', async () => {
        const staleTimestamp = Date.now() - 10 * 60 * 1000;
        const cachedData = {
            data: [{ FullName: 'Old' }],
            timestamp: staleTimestamp,
        };

        localStorage.setItem(CACHE_KEY, JSON.stringify(cachedData));
        mayaClient.get.mockResolvedValue([{ FullName: 'New Dev' }]);
        await appModule.actions.getAgents({ commit, state });
        expect(mayaClient.get).toHaveBeenCalled();
    });

    it('getAgents falls back to cache if API fails', async () => {
        const cachedData = {
            data: [{ FullName: 'Fallback Dev' }],
            timestamp: Date.now(),
        };

        localStorage.setItem(CACHE_KEY, JSON.stringify(cachedData));
        mayaClient.get.mockRejectedValue(new Error('API Down'));
        await appModule.actions.getAgents({ commit, state });
        expect(commit).toHaveBeenCalledWith('set-agents', cachedData.data);
        expect(commit).toHaveBeenCalledWith(
            'set-last-fetched',
            cachedData.timestamp,
        );
    });

    it('getAgents throws error if both API and cache are unavailable', async () => {
        mayaClient.get.mockRejectedValue(new Error('API Down'));

        await expect(
            appModule.actions.getAgents({ commit, state }),
        ).rejects.toThrow('API Down');
    });

    it('clearAgents removes cache and resets store state', () => {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: [] }));
        appModule.actions.clearAgents({ commit });
        expect(localStorage.getItem(CACHE_KEY)).toBeNull();
        expect(commit).toHaveBeenCalledWith('set-agents', []);
        expect(commit).toHaveBeenCalledWith('set-last-fetched', null);
    });

    it('refreshAgents triggers getAgents with forceRefresh flag', async () => {
        const dispatch = vi.fn();
        await appModule.actions.refreshAgents({ dispatch });
        expect(dispatch).toHaveBeenCalledWith('getAgents', {
            forceRefresh: true,
        });
    });
});
