import { mayaClient } from '@/services/api';

const state = {
    activeTab: 0,
    SOLatLngInput: '',
    searchMobile: '',
    // array of objects {id, name}, both id and name has agent first name as this used in b-table filtering
    agentList: [],
};

const getters = {};

const mutations = {
    'update-active-tab'(state, tabNo) {
        state.activeTab = tabNo;
    },
    'update-SO-Lat-Lng-Input'(state, latLng) {
        state.SOLatLngInput = latLng;
    },
    'set-agent-list'(state, agents) {
        // filtering agent list to filter out the one which has fullname enclosed within []
        state.agentList = agents
            .filter((agent) => {
                const fullName = agent.FullName.toLowerCase();
                return !(fullName.startsWith('[') && fullName.endsWith(']'));
            })
            .map((agent) => {
                return {
                    id: agent.FullName.split(' ')[0],
                    name: agent.FullName.split(' ')[0],
                };
            });
        state.agentList.push({ id: 'NA', name: 'NA' });
    },

    'set-search-mobile'(state, text){
        state.searchMobile = text
    }
};

const actions = {
    updateActiveTab({ commit }, tabNo) {
        commit('update-active-tab', tabNo);
    },
    updateSOLatLngInput({ commit }, latLng) {
        commit('update-SO-Lat-Lng-Input', latLng);
    },
    async getAgents({ commit }) {
        commit('set-agent-list', await mayaClient.get('/auth/user/agents'));
    },
    
    // Update Search text with text
    updateMobileInput({commit}, text){
        commit('set-search-mobile', text)
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
