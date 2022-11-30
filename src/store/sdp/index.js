import { mayaClient } from '@/services/api';
// import _ from 'lodash';

const state = {
    spotDetails: null,
    ownerInfoDetails: null,
    selectedSpot: [],
    isAvailable: false,
    loading: false,
    title: '',
    image: [],
};

const getters = {};

const mutations = {
    'update-spot-details'(state, spotDetails) {
        state.spotDetails = spotDetails;
    },

    'update-owner-info-details'(state, ownerInfoDetails) {
        state.ownerInfoDetails = ownerInfoDetails;
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
        state.image = [];
        if (Array.isArray(image)) {
            state.image = image;
        } else {
            state.image = [image];
        }
    },

    'update-title'(state, title) {
        state.title = title;
    },
};

const actions = {
    async getSpotDetails({ commit }, { spotId, isAdmin }) {
        commit('update-loading', true);
        console.log(isAdmin);
        const url = isAdmin
            ? `/site?siteID=${spotId}&getOwnerInfo=true`
            : `/site?siteID=${spotId}`;

        console.log(url);
        const res = await mayaClient.get(url);
        commit('update-spot-details', res.Site);
        commit('update-owner-info-details', res.User);
        const spot = {
            Name: res.Site['Name'],
            Lat: res.Site['Latitude'],
            Long: res.Site['Longitude'],
        };
        commit('update-selected-spot', spot);
        commit('update-is-available', res.Site['SlotsAvailable']);
        commit('update-loading', false);
        if (res.Site['SiteImages'].length > 0) {
            commit('update-image', res.Site['SiteImages']);
        } else {
            commit('update-image', res.Site['SiteImageURI']);
        }
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
