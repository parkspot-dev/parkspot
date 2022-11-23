import { mayaClient } from '@/services/api';
// import _ from 'lodash';

const state = {
    spotDetails: null,
    selectedSpot: [],
    isAvailable: false,
    loading: false,
    image: '',
    title: '',
};

const getters = {};

const mutations = {
    'update-spot-details'(state, spotDetails) {
        state.spotDetails = spotDetails;
    },

    'update-selected-spot'(state, spot) {
        state.selectedSpot = [];
        state.selectedSpot = [...state.selectedSpot, spot];
    },

    'update-is-available'(state, available) {
        if (available > 0) {
            state.isAvailable = true;
        } else {
            state.isAvailable = false;
        }
    },

    'update-loading'(state, loading) {
        state.loading = loading;
    },

    'update-image'(state, image) {
        state.image = image;
    },

    'update-title'(state, title) {
        state.title = title;
    },
};

const actions = {
    async getSpotDetails({ commit }, spotId) {
        commit('update-loading', true);
        const res = await mayaClient.get(`/site?siteID=${spotId}`);
        commit('update-spot-details', res.Site);
        const spot = {
            Name: res.Site['Name'],
            Lat: res.Site['Latitude'],
            Long: res.Site['Longitude'],
        };
        commit('update-selected-spot', spot);
        commit('update-is-available', res.Site['SlotsAvailable']);
        commit('update-loading', false);
        commit('update-image', res.Site['SiteImageURI']);
        commit('update-title', res.Site['Name']);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
