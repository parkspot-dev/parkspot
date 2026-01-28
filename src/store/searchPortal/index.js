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
    parkingRequests: [],
    interestedVOList: [],
    filteredParkingRequests: [],
    expiringRequestsCount: 0,
};

const getters = {};

const mutations = {
    'set-loading'(state) {
        state.loading = !state.loading;
    },
    'update-active-tab'(state, tabNo) {
        state.activeTab = tabNo;
    },
    'set-parking-requests'(state, result) {
        state.parkingRequests = result;
        state.filteredParkingRequests = result;
    },
    'set-interested-vo-list'(state, result) {
        state.interestedVOList = result;
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
    'set-error'(state, message) {
        state.hasError = !state.hasError;
        state.errorMessage = message;
    },
    'set-search-mobile'(state, text) {
        state.searchMobile = text;
    },
    'set-expiring-requests-count'(state, count) {
        state.expiringRequestsCount = count;
    },
    'set-filtered-parking-requests'(state, requests) {
        state.filteredParkingRequests = requests;
    },
};
const actions = {
    updateActiveTab({ commit }, tabNo) {
        commit('update-active-tab', tabNo);
    },
    async getAgents({ commit }) {
        commit('set-agent-list', await mayaClient.get('/auth/user/agents'));
    },
    // Get parking requests by mbile number
    async getParkingRequests({ commit, state }) {
        if (state.loading) return;
        try {
            commit('set-loading', true);
            const BASE_PARKING_REQUEST_URL = '/internal/parking-requests';
            const parkingRequestURL = state.searchMobile
                ? `${BASE_PARKING_REQUEST_URL}?mobile=${state.searchMobile.replace(
                      /\s+/g,
                      '',
                  )}`
                : BASE_PARKING_REQUEST_URL;
            const response = await mayaClient.get(parkingRequestURL);
            if (response.ErrorCode) {
                throw new Error(response.DisplayMsg);
            }
            commit('set-parking-requests', response.ParkingRequests);
            commit('set-interested-vo-list', response.ParkingRequests);
            commit(
                'set-expiring-requests-count',
                response.ExpiringRequestsCount,
            );
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
            commit('set-filtered-parking-requests', response);
        } catch (error) {
            commit('set-error', error.message);
        } finally {
            commit('set-loading', false);
        }
    },
    resetError({ commit }) {
        commit('set-error', '');
    },
    // Update Search text with text
    updateMobileInput({ commit }, text) {
        commit('set-search-mobile', text);
    },
    // Update SOLatLngInput
    updateSOLatLngInput({ commit }, text) {
        commit('update-SO-Lat-Lng-Input', text);
    },
    // setAgents
    setAgents({ commit }, list) {
        commit('set-agent-list', list);
    },

    extractExpiringRequests({ commit, state }) {
        const extractedCriticalRequests = state.filteredParkingRequests.filter(
            (request) => request.IsExpiring,
        );
        commit('set-filtered-parking-requests', extractedCriticalRequests);
    },

    extractRequestsByAgentName({ commit, state }, agentName) {
        const extractedAgentNameRequests = state.filteredParkingRequests.filter(
            (requests) => requests.Agent === agentName,
        );
        commit('set-filtered-parking-requests', extractedAgentNameRequests);
    },

    extractRequestsByStatus({ commit, state }, status) {
        const extractRequestsByStatusResult = state.filteredParkingRequests.filter(
            (requests) => requests.Status === status,
        );
        commit('set-filtered-parking-requests', extractRequestsByStatusResult);
    },

    resetFilterParkingRequests({ commit, state }) {
        commit('set-filtered-parking-requests', state.parkingRequests);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};