import { mayaClient } from '@/services/api';

const CACHE_KEY = 'maya_agents_cache';
const CACHE_TTL = 5 * 60 * 1000;

const state = {
    agents: [],
    loading: false,
    lastFetched: null,
};

const mutations = {
    'set-agents'(state, agents) {
        state.agents = agents;
    },
    'set-loading'(state, loading) {
        state.loading = loading;
    },
    'set-last-fetched'(state, timestamp) {
        state.lastFetched = timestamp;
    },
};

const filterAgents = (agents) => {
    return agents.filter((agent) => {
        const name = agent.FullName?.toLowerCase().trim() || '';
        return !(name.startsWith('[') && name.endsWith(']'));
    });
};

const actions = {
    async getAgents({ commit, state }) {
        if (state.loading) return;

        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const parsed = JSON.parse(cached);

                if (parsed?.data && parsed?.timestamp) {
                    const age = Date.now() - parsed.timestamp;

                    if (age < CACHE_TTL) {
                        commit('set-agents', parsed.data);
                        commit('set-last-fetched', parsed.timestamp);
                        return;
                    }
                }
            }
        } catch {
            localStorage.removeItem(CACHE_KEY);
        }

        commit('set-loading', true);

        try {
            const res = await mayaClient.get('/auth/user/agents');
            const data = res?.data || res;

            if (!Array.isArray(data)) {
                throw new Error('Invalid response format');
            }

            const filtered = filterAgents(data);
            const now = Date.now();

            try {
                localStorage.setItem(
                    CACHE_KEY,
                    JSON.stringify({
                        data: filtered,
                        timestamp: now,
                    }),
                );
            } catch {
                localStorage.removeItem(CACHE_KEY);
            }

            commit('set-agents', filtered);
            commit('set-last-fetched', now);
        } catch (error) {
            try {
                const cached = localStorage.getItem(CACHE_KEY);
                if (cached) {
                    const parsed = JSON.parse(cached);
                    if (parsed?.data) {
                        commit('set-agents', parsed.data);
                        commit('set-last-fetched', parsed.timestamp);
                        return;
                    }
                }
            } catch {
                localStorage.removeItem(CACHE_KEY);
            }

            throw error;
        } finally {
            commit('set-loading', false);
        }
    },

    clearAgents({ commit }) {
        localStorage.removeItem(CACHE_KEY);
        commit('set-agents', []);
        commit('set-last-fetched', null);
    },
};

const getters = {
    isCacheStale: (state) => {
        if (!state.lastFetched) return true;
        return Date.now() - state.lastFetched > CACHE_TTL;
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
