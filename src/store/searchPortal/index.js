import { mayaClient } from '@/services/api';

const state = {
    loading: false,
    hasError: false,
    errorMessage: '',
    activeTab: 0,
    SOLatLngInput: '',
    // array of objects {id, name}, both id and name has agent first name as this used in b-table filtering
    agentList: [],
    parkingRequests: [],
};

const getters = {};

const mutations = {
    'set-loading'(state) {
        state.loading = !state.loading;
    },
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
    'set-parking-requests'(state, parkingRequests) {
        state.parkingRequests = parkingRequests;
    },
    'set-error'(state, message) {
        state.hasError = !state.hasError;
        state.errorMessage = message;
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

    async getParkingRequests({ commit, state }, mobile) {
        if (state.loading) return;
        commit('set-loading', true);
        try {
            let parkingRequestURL = '/internal/parking-requests';
            if (mobile) {
                parkingRequestURL += `?mobile=${mobile.replace(/\s+/g, '')}`;
            }
            const response = await mayaClient.get(parkingRequestURL);
            if (response.ErrorCode) {
                throw new Error(response.DisplayMsg);
            }
            commit('set-parking-requests', response);
        } catch (error) {
            commit('set-error', error.message);
        } finally {
            commit('set-loading', false);
        }
    },

    resetError({ commit }) {
        commit('set-error', '');
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
