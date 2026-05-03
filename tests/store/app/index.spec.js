import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import appModule from '@/store/app';
import { mayaClient } from '@/services/api';

vi.mock('@/services/api', () => ({
    mayaClient: {
        get: vi.fn(),
    },
}));

const CACHE_KEY = 'maya_agents_cache';
const API_PATH = '/auth/user/agents';
const CACHE_TTL = 5 * 60 * 1000;
const NOW = new Date('2026-05-03T12:00:00.000Z');

const createState = () => JSON.parse(JSON.stringify(appModule.state));
const saveCache = (entry) => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
};

const readCache = () => JSON.parse(localStorage.getItem(CACHE_KEY));
describe('App Store - Agents Module', () => {
    let state;
    let commit;
    let getAgents;

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(NOW);
        vi.clearAllMocks();
        localStorage.clear();

        state = createState();
        commit = vi.fn();
        getAgents = () => appModule.actions.getAgents({ commit, state });
    });

    afterEach(() => {
        localStorage.clear();
        vi.useRealTimers();
    });

    it('returns early when an agents request is already in progress', async () => {
        appModule.mutations['set-loading'](state, true);
        await getAgents();
        expect(mayaClient.get).not.toHaveBeenCalled();
        expect(commit).not.toHaveBeenCalled();
    });

    it('filters bracketed system agents, caches valid agents, and resets loading when cache is missing', async () => {
        const apiAgents = [
            { FullName: '[System]' },
            { FullName: 'Dev Patel' },
            { FullName: 'Ava Chen' },
        ];
        const expectedAgents = [
            { FullName: 'Dev Patel' },
            { FullName: 'Ava Chen' },
        ];
        const timestamp = NOW.getTime();

        mayaClient.get.mockResolvedValue({ data: apiAgents });

        await getAgents();

        expect(mayaClient.get).toHaveBeenCalledWith(API_PATH);
        expect(commit).toHaveBeenNthCalledWith(1, 'set-loading', true);
        expect(commit).toHaveBeenNthCalledWith(2, 'set-agents', expectedAgents);
        expect(commit).toHaveBeenNthCalledWith(
            3,
            'set-last-fetched',
            timestamp,
        );
        expect(commit).toHaveBeenNthCalledWith(4, 'set-loading', false);
        expect(commit).toHaveBeenCalledTimes(4);
        expect(readCache()).toEqual({
            data: expectedAgents,
            timestamp,
        });
    });

    it('uses fresh cached agents and skips the API request', async () => {
        const cachedEntry = {
            data: [{ FullName: 'Cached Dev' }],
            timestamp: NOW.getTime() - 1_000,
        };

        saveCache(cachedEntry);
        await getAgents();
        expect(mayaClient.get).not.toHaveBeenCalled();
        expect(commit).toHaveBeenNthCalledWith(
            1,
            'set-agents',
            cachedEntry.data,
        );
        expect(commit).toHaveBeenNthCalledWith(
            2,
            'set-last-fetched',
            cachedEntry.timestamp,
        );
        expect(commit).toHaveBeenCalledTimes(2);
    });

    it('refetches agents when the cached entry is stale', async () => {
        const staleCache = {
            data: [{ FullName: 'Old Dev' }],
            timestamp: NOW.getTime() - CACHE_TTL - 1,
        };
        const apiAgents = [{ FullName: 'New Dev' }];
        const timestamp = NOW.getTime();
        saveCache(staleCache);
        mayaClient.get.mockResolvedValue(apiAgents);
        await getAgents();

        expect(mayaClient.get).toHaveBeenCalledWith(API_PATH);
        expect(commit).toHaveBeenNthCalledWith(1, 'set-loading', true);
        expect(commit).toHaveBeenNthCalledWith(2, 'set-agents', apiAgents);
        expect(commit).toHaveBeenNthCalledWith(
            3,
            'set-last-fetched',
            timestamp,
        );
        expect(commit).toHaveBeenNthCalledWith(4, 'set-loading', false);
        expect(commit).toHaveBeenCalledTimes(4);
        expect(readCache()).toEqual({
            data: apiAgents,
            timestamp,
        });
    });

    it('falls back to cached agents when the API request fails after cache expiration', async () => {
        const staleCache = {
            data: [{ FullName: 'Fallback Dev' }],
            timestamp: NOW.getTime() - CACHE_TTL - 1,
        };

        saveCache(staleCache);
        mayaClient.get.mockRejectedValue(new Error('API Down'));
        await getAgents();
        expect(mayaClient.get).toHaveBeenCalledWith(API_PATH);
        expect(commit).toHaveBeenNthCalledWith(1, 'set-loading', true);
        expect(commit).toHaveBeenNthCalledWith(
            2,
            'set-agents',
            staleCache.data,
        );
        expect(commit).toHaveBeenNthCalledWith(
            3,
            'set-last-fetched',
            staleCache.timestamp,
        );
        expect(commit).toHaveBeenNthCalledWith(4, 'set-loading', false);
        expect(commit).toHaveBeenCalledTimes(4);
    });

    it('throws the API error when no cached agents are available for fallback', async () => {
        mayaClient.get.mockRejectedValue(new Error('API Down'));
        await expect(getAgents()).rejects.toThrow('API Down');
        expect(mayaClient.get).toHaveBeenCalledWith(API_PATH);
        expect(commit).toHaveBeenNthCalledWith(1, 'set-loading', true);
        expect(commit).toHaveBeenNthCalledWith(2, 'set-loading', false);
        expect(commit).toHaveBeenCalledTimes(2);
    });

    it('throws an invalid response error when the API payload is not an array', async () => {
        mayaClient.get.mockResolvedValue({
            data: { FullName: 'Invalid Agent' },
        });

        await expect(getAgents()).rejects.toThrow('Invalid response format');
        expect(mayaClient.get).toHaveBeenCalledWith(API_PATH);
        expect(commit).toHaveBeenNthCalledWith(1, 'set-loading', true);
        expect(commit).toHaveBeenNthCalledWith(2, 'set-loading', false);
        expect(commit).toHaveBeenCalledTimes(2);
        expect(localStorage.getItem(CACHE_KEY)).toBeNull();
    });

    it('removes cached agents and resets the store through clearAgents', () => {
        saveCache({
            data: [{ FullName: 'Cached Dev' }],
            timestamp: NOW.getTime(),
        });

        appModule.actions.clearAgents({ commit });
        expect(localStorage.getItem(CACHE_KEY)).toBeNull();
        expect(commit).toHaveBeenNthCalledWith(1, 'set-agents', []);
        expect(commit).toHaveBeenNthCalledWith(2, 'set-last-fetched', null);
        expect(commit).toHaveBeenCalledTimes(2);
    });

    it('marks the cache as stale when nothing has been fetched yet', () => {
        const isCacheStale = appModule.getters.isCacheStale(state);
        expect(isCacheStale).toBe(true);
    });

    it('marks the cache as stale when the cached timestamp has expired', () => {
        appModule.mutations['set-last-fetched'](
            state,
            NOW.getTime() - CACHE_TTL - 1,
        );

        const isCacheStale = appModule.getters.isCacheStale(state);
        expect(isCacheStale).toBe(true);
    });

    it('marks the cache as fresh when the cached timestamp is still within the ttl', () => {
        appModule.mutations['set-last-fetched'](
            state,
            NOW.getTime() - CACHE_TTL + 1,
        );

        const isCacheStale = appModule.getters.isCacheStale(state);
        expect(isCacheStale).toBe(false);
    });
});
