import { mayaClient } from '@/services/api';
// import _ from 'lodash';

const state = {
    locations: [],
    selectedLocation: {
        city: '',
        state: '',
        country: '',
        locName: '',
    },
    selectedLocationLatLng: null,
    mapConfig: {
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [77.5946, 12.9716], //  default bengaluru lat, lng.
        zoom: 11,
    },
    center: null,
    totalPages: 1, // default page number
    srpResults: [],
    paginateSrpResults: [],
    recentSearch: [],
    recentID: 0,
};

const getters = {
    getMapConfig(state) {
        return state.mapConfig;
    },

    getLocationName(state) {
        return state.locations;
    },

    getNewMapCenter(state) {
        return state.center;
    },

    getLocDetails(state) {
        return {
            locDetails: state.selectedLocation,
            lnglat: state.center,
        };
    },

    getSrpResults(state) {
        return state.srpResults;
    },

    getPaginateSrpResults(state) {
        return state.paginateSrpResults;
    },

    getTotalPages() {
        return state.totalPages;
    },
};

const mutations = {
    'update-location'(state, locations) {
        state.locations = [...state.recentSearch, ...locations];
    },

    'update-selected-location'(state, selectedLocation) {
        state.selectedLocation = selectedLocation;

        const recentSearchObj = {
            fromLS: true,
            ...selectedLocation,
        };

        const recentSearches = [...state.recentSearch];

        const uniqueRecentSearches = recentSearches.filter((recentSearch) => {
            if (recentSearch.id === recentSearchObj.id) {
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

    'update-selected-city'(state, city) {
        state.selectedLocation.city = city.text || '';
    },

    // region is same as state like jharkhand, karnataka etc.
    'update-selected-state'(state, region) {
        state.selectedLocation.state = region.text || '';
    },

    'update-selected-country'(state, country) {
        state.selectedLocation.country = country.text || '';
    },

    'update-map-config'(state, center) {
        state.mapConfig.center = center;
        state.center = center;
    },

    'update-total-pages'(state, data) {
        state.totalPages = data;
    },

    'update-srp-results'(state, data) {
        state.srpResults = data;
    },

    'update-map-center'(state, data) {
        state.center = data;
    },

    'update-paginated-srp-data'(state, currPageNum) {
        state.paginateSrpResults = [];

        // loop to get list of srp result in current page
        for (
            let i = (currPageNum - 1) * 3;
            i < currPageNum * 3 && i < state.srpResults.length;
            i++
        ) {
            state.paginateSrpResults.push(state.srpResults[i]);
        }
    },
};

const actions = {
    async getPredictedLocations({ commit }, query) {
        const token = 'AIzaSyAtHsC3zbjqgFkphcIjgG5OhrISlJ0bOaI';
        // autocomplete prediction api give list of location prediction contains place_id
        const autocompleteURL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&components=country:in&key=${token}`;
        const predictionLocRes = await fetch(autocompleteURL);
        const locDetails = await predictionLocRes.json();
        const locDetailsArr = locDetails.predictions;
        commit('update-location', locDetailsArr);
    },

    async getSelectedLocationLatLng({ commit }, selectedLocation) {
        commit('update-selected-location', selectedLocation);
        const token = 'AIzaSyAtHsC3zbjqgFkphcIjgG5OhrISlJ0bOaI';
        const placeId = selectedLocation.place_id;
        const latLngURL = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${token}`;
        const placeDetailRes = await fetch(latLngURL);
        const placeDetail = await placeDetailRes.json();
        commit('update-selected-location-latlng', placeDetail.results[0]);
        const latLng = placeDetail.results[0].geometry.location;
        commit('update-map-config', [latLng.lng, latLng.lat]);
    },

    async srpCall({ state, commit }) {
        const data = await mayaClient.get(
            `/search?lat=${state.center[1]}&long=${state.center[0]}&start=20201115t1250&end=20201115t1400`,
        );
        if (data && Object.prototype.hasOwnProperty.call(data, 'Sites')) {
            commit('update-srp-results', data.Sites);
            commit('update-total-pages', data.Sites.length);
            commit('update-paginated-srp-data', 1); // paginated srp result stored
            state.srpResults = data.Sites;
        } else {
            throw data.DisplayMsg;
        }
    },

    updateCenterSrp({ state, commit }) {
        const ys = state.paginateSrpResults.reduce((long, site) => {
            return long + site.Long;
        }, 0);
        const xs = state.paginateSrpResults.reduce((a, site) => {
            return a + site.Lat;
        }, 0);
        commit('update-map-config', [
            ys / state.paginateSrpResults.length,
            xs / state.paginateSrpResults.length,
        ]);
    },

    getFromRecent({ state }) {
        state.recentSearch = JSON.parse(localStorage.getItem('recent'));
        if (state.recentSearch === null) {
            return (state.recentSearch = []);
        }
        return state.recentSearch;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
