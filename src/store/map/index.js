import { mapBoxClient, mayaClient } from '@/services/api';
import _ from 'lodash';

const state = {
    locations: [],
    selectedLocation: {
        city: '',
        state: '',
        country: '',
        locName: '',
    },
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
    filteredSrpResults: [],
    userCurrentLocation: [77.5946, 12.9716], //  default bengaluru lat, lng.
    // Filters array contains objects with:
    // - name: Filter type (e.g., 'Rent')
    // - minValue: Minimum range value
    // - maxValue: Maximum range value
    filters: [],
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

    getUserLocation() {
        return state.userCurrentLocation;
    },
};

const mutations = {
    'update-location'(state, locations) {
        state.locations = [...state.recentSearch, ...locations];
    },

    'update-selected-location'(state, location) {
        state.selectedLocation.locName = location.place_name;

        const recentSearchObj = {
            fromLS: true,
            ...location,
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

    'update-srp-results'(state, srpResults) {
        state.srpResults = srpResults;
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

    'update-filtered-srp-results'(state, srpResults) {
        state.filteredSrpResults = srpResults;
    },

    'update-user-location'(state, center) {
        state.userCurrentLocation = center;
    },

    'update-map-zoom'(state, value) {
        state.mapConfig.zoom = value;
    },

    'update-filter-array'(state, filter) {
        state.filters.push(filter);
        console.log('Filter obj', state.filters);
    },
};

const actions = {
    async searchLocation({ commit }, query) {
        const token =
            'pk.eyJ1IjoicGFya3Nwb3QiLCJhIjoiY2xzbTIzdTllMGIzajJqb3owbXY3bjVqYyJ9.elvf98anNZZj4h-x5Rd0mg'; // parkspotofficial@gmail.com
        const url = `/geocoding/v5/mapbox.places/${query}.json?access_token=${token}&proximity=77.4977,12.9716`;
        const responseData = await mapBoxClient.get(url);
        const searchResult = _.get(responseData, 'features', []);
        commit('update-location', searchResult);
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
            commit('update-filtered-srp-results', state.srpResults);
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

    applyFilters({ commit, state }) {
        let filteredSrpResults = [...state.srpResults];
    
        for (let filter of state.filters) {
            if (filter.name === 'Distance') {
                filteredSrpResults = filteredSrpResults.filter(
                    (srpResult) => srpResult.Distance >= filter.minValue && srpResult.Distance <= filter.maxValue
                );
            } 
            else if (filter.name === 'Rate') {
                filteredSrpResults = filteredSrpResults.filter(
                    (srpResult) => srpResult.Rate >= filter.minValue && srpResult.Rate <= filter.maxValue
                );
            } 
            else if (filter.name === 'Status') {
                if (filter.minValue > 0) {
                    // Slots Available
                    filteredSrpResults = filteredSrpResults.filter(
                        (srpResult) => srpResult.SlotsAvailable > 0
                    );
                } else {
                    // No Slots Available
                    filteredSrpResults = filteredSrpResults.filter(
                        (srpResult) => srpResult.SlotsAvailable === 0
                    );
                }
            }
        }
    
        commit('update-filtered-srp-results', filteredSrpResults);
    },
    
    updateUsersCurrentLocation({ commit }, center) {
        commit('update-user-location', center);
    },

    // Update zoom value
    updateZoomValue({ commit }, zoomValue) {
        commit('update-map-zoom', zoomValue);
    },

    //Update filter Array
    updateFilter({ commit }, { name, value }) {
        if (!name || !value || typeof value !== 'object') {
            console.error("Invalid filter data", { name, value });
            return;
        }

        const filterObj = {
            name: name,
            minValue: value.min ?? 0, 
            maxValue: value.max ?? Infinity 
        };
    
        commit('update-filter-array', filterObj);
    },

    removeFilterByName({ state }, filterName) {
        state.filters = state.filters.filter(
            (filter) => filter.name !== filterName,
        );
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
