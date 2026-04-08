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

const mutations = {
    setLoading(state, value) {
        state.loading = value;
    },
    updateActiveTab(state, tabNo) {
        state.activeTab = tabNo;
    },
    setParkingRequests(state, result) {
        state.parkingRequests = result;
        state.filteredParkingRequests = result;
    },
    setInterestedVOList(state, result) {
        state.interestedVOList = result;
    },
    updateSOLatLngInput(state, latLng) {
        state.SOLatLngInput = latLng;
    },
    setAgentList(state, agents) {
        // filtering agent list to filter out the one which has fullname enclosed within []
        const uniqueAgentNames = [
            ...new Set(
                agents
                    .filter((agent) => {
                        const fullName = agent.FullName?.toLowerCase() || '';
                        return !(
                            fullName.startsWith('[') && fullName.endsWith(']')
                        );
                    })
                    .map((agent) => agent.FullName?.split(' ')[0])
                    .filter(Boolean),
            ),
        ];
        state.agentList = [
            ...uniqueAgentNames.map((name) => ({
                id: name,
                name,
            })),
            ...(!uniqueAgentNames.includes('NA')
                ? [{ id: 'NA', name: 'NA' }]
                : []),
        ];
    },
    setError(state, message) {
        state.hasError = !!message;
        state.errorMessage = message;
    },
    setSearchMobile(state, text) {
        state.searchMobile = text;
    },
    setExpiringRequestsCount(state, count) {
        state.expiringRequestsCount = count;
    },
    setFilteredParkingRequests(state, requests) {
        state.filteredParkingRequests = requests;
    },
};
const actions = {
    updateActiveTab({ commit }, tabNo) {
        commit('updateActiveTab', tabNo);
    },
    async getAgents({ commit, rootState, dispatch }) {
        if (!rootState.app?.agents?.length) {
            await dispatch('app/getAgents', null, { root: true });
        }
        const agents = rootState.app?.agents || [];
        commit('setAgentList', agents);
    },
    // Get parking requests by mbile number
    async getParkingRequests({ commit, state }) {
        if (state.loading) return;
        try {
            commit('setLoading', true);
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
            const parkingRequests = response.ParkingRequests || [];
            commit('setParkingRequests', parkingRequests);
            commit('setInterestedVOList', parkingRequests);
            commit(
                'setExpiringRequestsCount',
                response.ExpiringRequestsCount || 0,
            );
        } catch (error) {
            commit('setError', error.message);
        } finally {
            commit('setLoading', false);
        }
    },
    // Get Interested VO by lat lng value
    async getInterestedVO({ commit }, latlng) {
        commit('setLoading', true);
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
            const parkingRequests = response.ParkingRequests || [];
            commit('setInterestedVOList', parkingRequests);
            commit('setParkingRequests', parkingRequests);
        } catch (error) {
            commit('setError', error.message);
        } finally {
            commit('setLoading', false);
        }
    },
    resetError({ commit }) {
        commit('setError', '');
    },
    // Update Search text with text
    updateMobileInput({ commit }, text) {
        commit('setSearchMobile', text);
    },
    // Update SOLatLngInput
    updateSOLatLngInput({ commit }, text) {
        commit('updateSOLatLngInput', text);
    },
    // setAgents
    setAgents({ commit }, list) {
        commit('setAgentList', list);
    },

    applyParkingRequestFilters({ commit, state }, filters = {}) {
        const { isExpiring = false, status = null, agentName = '' } = filters;
        const filteredRequests = state.parkingRequests.filter((request) => {
            if (isExpiring && !request.IsExpiring) {
                return false;
            }

            if (status !== null && status !== undefined && status !== '') {
                if (request.Status !== status) {
                    return false;
                }
            }

            if (agentName && request.Agent !== agentName) {
                return false;
            }

            return true;
        });

        commit('setFilteredParkingRequests', filteredRequests);
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
