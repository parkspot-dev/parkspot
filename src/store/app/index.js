import { mayaClient } from '@/services/api';

const state = {
    agents: [],
};

const mutations = {
    'set-agents'(state, agents) {
        state.agents = agents.filter((agent) => {
            const name = agent.FullName?.toLowerCase() || '';
            return !(name.startsWith('[') && name.endsWith(']'));
        });
    },
};

const actions = {
    async getAgents({ commit, state }) {
        if (state.agents.length && localStorage.getItem('agents')) return;

        try {
            const cached = localStorage.getItem('agents');

            if (cached) {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length) {
                    commit('set-agents', parsed);
                    return;
                }
                localStorage.removeItem('agents');
            }

            const res = await mayaClient.get('/auth/user/agents');
            localStorage.setItem('agents', JSON.stringify(res));
            commit('set-agents', res);
        } catch {
            localStorage.removeItem('agents');
            commit('set-agents', []); 
        }
    },

    clearAgents({ commit }) {
        localStorage.removeItem('agents');
        commit('set-agents', []);
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
