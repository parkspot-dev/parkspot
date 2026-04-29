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
        const name = agent.FullName?.toLowerCase() || '';
        return !(name.startsWith('[') && name.endsWith(']'));
    });
};

const actions = {
    async getAgents({ commit, state }, { forceRefresh = false } = {}) {
        if (state.loading) return;

        if (typeof window !== 'undefined') {
            try {
                const cached = localStorage.getItem(CACHE_KEY);
                if (cached && !forceRefresh) {
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
        }

        commit('set-loading', true);

        try {
            const res = await mayaClient.get('/auth/user/agents');

            if (!Array.isArray(res)) {
                throw new Error('Invalid response format');
            }

            const filtered = filterAgents(res);

            if (typeof window !== 'undefined') {
                try {
                    localStorage.setItem(
                        CACHE_KEY,
                        JSON.stringify({
                            data: filtered,
                            timestamp: Date.now(),
                        }),
                    );
                } catch {
                    localStorage.removeItem(CACHE_KEY);
                }
            }

            commit('set-agents', filtered);
            commit('set-last-fetched', Date.now());
        } catch (error) {
            if (typeof window !== 'undefined') {
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
            }

            throw error;
        } finally {
            commit('set-loading', false);
        }
    },

    clearAgents({ commit }) {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(CACHE_KEY);
        }
        commit('set-agents', []);
        commit('set-last-fetched', null);
    },

    refreshAgents({ dispatch }) {
        return dispatch('getAgents', { forceRefresh: true });
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
