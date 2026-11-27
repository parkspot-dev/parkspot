import { mayaClient } from '@/services/api';
import { reportError } from '@/telemetry';
import {
    getStoredValue,
    removeStoredValue,
    setStoredValue,
} from '@/utils/storage';

const cacheParseError = new Error('Invalid Maya agents cache');
const cacheWriteError = new Error('Failed to cache Maya agents');
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
            const cached = getStoredValue(CACHE_KEY);
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
            reportError(cacheParseError, {
                source: 'app',
                failure: 'agents_cache_parse',
            });
            removeStoredValue(CACHE_KEY);
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
                setStoredValue(
                    CACHE_KEY,
                    JSON.stringify({
                        data: filtered,
                        timestamp: now,
                    }),
                );
            } catch {
                reportError(cacheWriteError, {
                    source: 'app',
                    failure: 'agents_cache_write',
                });
                removeStoredValue(CACHE_KEY);
            }

            commit('set-agents', filtered);
            commit('set-last-fetched', now);
        } catch (error) {
            try {
                const cached = getStoredValue(CACHE_KEY);
                if (cached) {
                    const parsed = JSON.parse(cached);
                    if (parsed?.data) {
                        commit('set-agents', parsed.data);
                        commit('set-last-fetched', parsed.timestamp);
                        return;
                    }
                }
            } catch {
                reportError(cacheParseError, {
                    source: 'app',
                    failure: 'agents_cache_fallback',
                });
                removeStoredValue(CACHE_KEY);
            }

            throw error;
        } finally {
            commit('set-loading', false);
        }
    },

    clearAgents({ commit }) {
        removeStoredValue(CACHE_KEY);
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
