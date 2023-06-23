import { mayaClient } from '@/services/api';
import { firebase, getDatabase, ref, get, child } from '../../firebase';

const state = {
    locations: [],
    selectedLocation: null,
    selectedLocationLatLng: null,
    mapCenter: { lat: 17.471356, lng: 78.3344256 }, //  default bengaluru lat, lng.
    srpResults: [],
    recentSearch: [],
    recentID: 0,
    GOOGLE_TOKEN: '',
    filteredSrpResults: [],
};

const getters = {
    getLocationName(state) {
        return state.locations;
    },

    getNewMapCenter(state) {
        return state.center;
    },

    getSrpResults(state) {
        return state.srpResults;
    },
};

const mutations = {
    'update-location'(state, locations) {
        state.locations = [...state.recentSearch, ...locations];
    },

    'update-selected-location'(state, selectedLocation) {
        // console.log(selectedLocation);
        state.selectedLocation = selectedLocation;

        // const recentSearchObj = {
        //     fromLS: true,
        //     ...selectedLocation,
        // };

        // const recentSearches = [...state.recentSearch];

        // const uniqueRecentSearches = recentSearches.filter((recentSearch) => {
        //     if (recentSearch.place_id === recentSearchObj.place_id) {
        //         return false;
        //     }
        //     return true;
        // });

        // // performing LIFO in size of 3.
        // if (uniqueRecentSearches.length >= 3) {
        //     uniqueRecentSearches.pop();
        //     uniqueRecentSearches.unshift(recentSearchObj);
        // } else {
        //     uniqueRecentSearches.unshift(recentSearchObj);
        // }

        // state.recentSearch = [...uniqueRecentSearches];
        // // JSON used to store array as string in LS
        // localStorage.setItem('recentNew', JSON.stringify(state.recentSearch));
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
    'update-google-token'(state, token) {
        state.GOOGLE_TOKEN = token;
    },
};

const actions = {
    async getGoogleToken({ commit }) {
        const db = getDatabase(firebase);
        const dbref = ref(db);
        const res = await get(child(dbref, `admin`));
        const credentials = await res.val();
        commit('update-google-token', credentials.google_map.token);
    },

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
        console.log('updateInitialSelectedLatLng');
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
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
