import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import appModule from '@/store/app';
import { mayaClient } from '@/services/api';

vi.mock('@/services/api', () => ({
    mayaClient: {
        get: vi.fn(),
    },
}));

const { state: initialState, mutations, actions } = appModule;

describe('App Store - Agents Module', () => {
    let state;
    let commit;

    beforeEach(() => {
        state = JSON.parse(JSON.stringify(initialState));
        commit = vi.fn();
        localStorage.clear();
        vi.clearAllMocks();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('has correct default state', () => {
        expect(state.agents).toEqual([]);
    });

    it('set-agents filters system users', () => {
        const agents = [
            { FullName: 'Ayush Kumar' },
            { FullName: '[System User]' },
        ];

        mutations['set-agents'](state, agents);

        expect(state.agents).toEqual([{ FullName: 'Ayush Kumar' }]);
    });

    it('getAgents fetches from API and caches result', async () => {
        const apiAgents = [{ FullName: 'API Agent' }];
        mayaClient.get.mockResolvedValue(apiAgents);

        await actions.getAgents({ commit });

        expect(mayaClient.get).toHaveBeenCalledWith('/auth/user/agents');
        expect(localStorage.getItem('agents')).toBe(JSON.stringify(apiAgents));
        expect(commit).toHaveBeenCalledWith('set-agents', apiAgents);
    });

    it('getAgents falls back to cached agents when API fails', async () => {
        const cachedAgents = [
            { FullName: 'Ayush Kumar' },
            { FullName: '[System User]' },
        ];
        localStorage.setItem('agents', JSON.stringify(cachedAgents));
        mayaClient.get.mockRejectedValue(new Error('Network error'));

        await actions.getAgents({ commit });

        expect(mayaClient.get).toHaveBeenCalledWith('/auth/user/agents');
        expect(commit).toHaveBeenCalledWith('set-agents', cachedAgents);
        expect(localStorage.getItem('agents')).toBe(JSON.stringify(cachedAgents));
    });

    it('getAgents clears invalid cache and commits empty list on error', async () => {
        localStorage.setItem('agents', JSON.stringify([]));
        mayaClient.get.mockRejectedValue(new Error('Network error'));

        await actions.getAgents({ commit });

        expect(localStorage.getItem('agents')).toBeNull();
        expect(commit).toHaveBeenCalledWith('set-agents', []);
    });

    it('clearAgents removes cache and resets state', () => {
        localStorage.setItem('agents', JSON.stringify([{ FullName: 'Test' }]));

        actions.clearAgents({ commit });

        expect(localStorage.getItem('agents')).toBeNull();
        expect(commit).toHaveBeenCalledWith('set-agents', []);
    });
});
