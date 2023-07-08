import { mayaClient } from '@/services/api';

const state = {
    suggestionLocations: [],
    selectedLocation: null,
    selectedLocationLatLng: null,
    mapCenter: { lat: 17.471356, lng: 78.3344256 }, //  default bengaluru lat, lng.
    srpResults: [],
    recentSearch: [],
    recentID: 0,
    filteredSrpResults: [],
};

const getters = {};

const mutations = {
    'update-suggestion-location'(state, suggestionLocations) {
        state.suggestionLocations = suggestionLocations;
    },

    'update-selected-location'(state, selectedLocation) {
        state.selectedLocation = selectedLocation;
    },

    'update-selected-location-latlng'(state, selectedLocationLatLng) {
        state.selectedLocationLatLng = selectedLocationLatLng;
    },

    'update-map-center'(state, center) {
        state.mapCenter = center;
    },

    'update-srp-results'(state, srpResults) {
        state.srpResults = srpResults;
    },

    'update-filtered-srp-results'(state, srpResults) {
        state.filteredSrpResults = srpResults;
    },
};

const actions = {
    async getSelectedLocationLatLng({ commit, state }, selectedLocation) {
        const lat = selectedLocation.geometry.location.lat();
        const lng = selectedLocation.geometry.location.lng();
        const formattedAddress = selectedLocation.formatted_address;

        commit('update-selected-location-latlng', {
            lat,
            lng,
            formattedAddress,
        });
        commit('update-map-center', { lat, lng });
    },

    updateInitialSelectedLatLng({ commit, state }, selectedLocation) {
        const formattedAddress = selectedLocation.formatted_address;

        commit('update-selected-location-latlng', {
            lat: selectedLocation.geometry.location.lat,
            lng: selectedLocation.geometry.location.lng,
            formattedAddress,
        });
        commit('update-map-center', {
            lat: selectedLocation.geometry.location.lat,
            lng: selectedLocation.geometry.location.lng,
        });
    },

    async srpCall({ state, commit }) {
        const data = await mayaClient.get(
            `/search?lat=${state.mapCenter.lat}&long=${state.mapCenter.lng}&start=20201115t1250&end=20201115t1400`,
        );
        if (data && Object.prototype.hasOwnProperty.call(data, 'Sites')) {
            commit('update-srp-results', data.Sites);
            state.srpResults = data.Sites;
            commit('update-filtered-srp-results', state.srpResults);
        } else {
            throw data.DisplayMsg;
        }
    },

    getFromRecent({ state }) {
        state.recentSearch = JSON.parse(localStorage.getItem('recentNew'));
        if (state.recentSearch === null) {
            return (state.recentSearch = []);
        }
        return state.recentSearch;
    },

    updateSrpResults({ commit }, filterOptions) {
        let filteredSrpResults = [];
        if (filterOptions.length === 1) {
            if (filterOptions[0] === 'Available') {
                filteredSrpResults = state.srpResults.filter(
                    (srpResult) => srpResult.SlotsAvailable > 0,
                );
            } else if (filterOptions[0] === 'Rented out') {
                filteredSrpResults = state.srpResults.filter(
                    (srpResult) => srpResult.SlotsAvailable === 0,
                );
            }
        } else {
            filteredSrpResults = state.srpResults;
        }

        commit('update-filtered-srp-results', filteredSrpResults);
    },

    updateMapCenter({ commit }, mapCenter) {
        commit('update-map-center', mapCenter);
    },

    addSuggestionLocations({ commit }, suggestionLocations) {
        commit('update-suggestion-location', suggestionLocations);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
