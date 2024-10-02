const state = {
    activeTab: 0,
    SOLatLngInput: '',
    agentList: [], // array of objects {id, name}
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
                    id: agent.UserName,
                    name: agent.FullName.split(' ')[0],
                };
            });
    },
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
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
