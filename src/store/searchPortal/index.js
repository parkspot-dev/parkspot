import { mayaClient } from '@/services/api';

const state = {
    loading: false,
    hasError: false,
    errorMessage: '',
    activeTab: 0,
    SOLatLngInput: '',
    searchMobile: '',
    // array of objects {id, name}, both id and name has agent first name as this used in b-table filtering
    agentList: [],
    totalRequests: [],
    parkingRequests: [],
    interestedVOList: [],
    isTotalRequestFetched: false,
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
    'set-total-requests'(state, requests) {
        state.isTotalRequestFetched = true;
        state.totalRequests = requests;
    },
    'set-parking-requests'(state, parkingRequests) {
        state.parkingRequests = parkingRequests;
    },
    'set-interested-vo-list'(state, list) {
        state.interestedVOList = list;
    },
    'set-error'(state, message) {
        state.hasError = !state.hasError;
        state.errorMessage = message;
    },
    'set-search-mobile'(state, text) {
        state.searchMobile = text;
    },
};
const actions = {
    updateActiveTab({ commit }, tabNo) {
        commit('update-active-tab', tabNo);
    },
    async getAgents({ commit }) {
        commit('set-agent-list', await mayaClient.get('/auth/user/agents'));
    },
    // Get Total Results
    async getTotalRequests({ commit, state }) {
        if (state.loading) return;
        commit('set-loading', true);
        try {
            const parkingRequestURL = '/internal/parking-requests';
            const response = await mayaClient.get(parkingRequestURL);
            if (response.ErrorCode) {
                throw new Error(response.DisplayMsg);
            }
            commit('set-total-requests', response);
            commit('set-parking-requests', response);
            commit('set-interested-vo-list', response);
        } catch (error) {
            commit('set-error', error.message);
        } finally {
            commit('set-loading', false);
        }
    },
    // Get parking requests by mbile number
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
    // Get Interested VO by lat lng value
    async getInterestedVO({ commit }, latlng) {
        commit('set-loading', true);
        try {
            const [lat, lng] = latlng
                .trim()
                .split(',')
                .map((coord) => coord.trim());
            const response = await mayaClient.get(
                `/search-requests?lat=${lat}&long=${lng}`,
            );
            if (response.ErrorCode) {
                throw new Error(response.DisplayMsg);
            }
            commit('set-interested-vo-list', response);
        } catch (error) {
            commit('set-error', error.message);
        } finally {
            commit('set-loading', false);
        }
    },
    resetError({ commit }) {
        commit('set-error', '');
    },
    // Reset parking requests to totalResults
    resetParkingRequest({ commit }, list) {
        commit('set-parking-requests', list);
    },
    // Reset Interested VO List to totalResults
    resetInterestedVOList({ commit }, list) {
        commit('set-interested-vo-list', list);
    },
    // Update Search text with text
    updateMobileInput({ commit }, text) {
        commit('set-search-mobile', text);
    },
    // Update SOLatLngInput
    updateSOLatLngInput({ commit }, text) {
        commit('update-SO-Lat-Lng-Input', text);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
