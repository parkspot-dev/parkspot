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
        console.log(selectedLocation);
        state.selectedLocation = selectedLocation;

        const recentSearchObj = {
            fromLS: true,
            ...selectedLocation,
        };

        const recentSearches = [...state.recentSearch];

        const uniqueRecentSearches = recentSearches.filter((recentSearch) => {
            if (recentSearch.place_id === recentSearchObj.place_id) {
                return false;
            }
            return true;
        });

        // performing LIFO in size of 3.
        if (uniqueRecentSearches.length >= 3) {
            uniqueRecentSearches.pop();
            uniqueRecentSearches.unshift(recentSearchObj);
        } else {
            uniqueRecentSearches.unshift(recentSearchObj);
        }

        state.recentSearch = [...uniqueRecentSearches];
        // JSON used to store array as string in LS
        localStorage.setItem('recent', JSON.stringify(state.recentSearch));
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
    async getPredictedLocations({ dispatch, commit, state }, query) {
        // autocomplete prediction api give list of location prediction contains place_id
        dispatch('getGoogleToken');
        const autocompleteURL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&components=country:in&key=${state.GOOGLE_TOKEN}`;
        const predictionLocRes = await fetch(autocompleteURL);
        const locDetails = await predictionLocRes.json();
        const locDetailsArr = locDetails.predictions;
        commit('update-location', locDetailsArr);
    },

    async getSelectedLocationLatLng({ commit, state }, selectedLocation) {
        dispatch('getGoogleToken');
        commit('update-selected-location', selectedLocation);
        const placeId = selectedLocation.place_id;
        const latLngURL = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${state.GOOGLE_TOKEN}`;
        const placeDetailRes = await fetch(latLngURL);
        const placeDetail = await placeDetailRes.json();
        commit('update-selected-location-latlng', placeDetail.results[0]);
        const latLng = placeDetail.results[0].geometry.location;
        commit('update-map-center', latLng);
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
        state.recentSearch = JSON.parse(localStorage.getItem('recent'));
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
