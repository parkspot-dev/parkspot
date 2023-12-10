import { mayaClient } from '@/services/api';
import { getValueFromFirebase } from '../../firebase';
// import _ from 'lodash';

const state = {
    spotDetails: null,
    ownerInfoDetails: null,
    selectedSpot: [],
    isAvailable: false,
    loading: false,
    title: '',
    thumbnail: [],
    images: [],
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

    'update-image'(state, images) {
        state.images = [];
        state.images = images.map((img) => img.ImageURL);
    },

    'update-thumbnail-image'(state, image) {
        state.thumbnail = [];
        state.thumbnail = [image];
    },

    'update-title'(state, title) {
        state.title = title;
    },
};

const actions = {
    async getSpotDetails({ commit }, { spotId, isAdmin }) {
        commit('update-loading', true);
        let url;
        if (isAdmin) {
            const credentials = getValueFromFirebase(`admin`);
            url = `/site?site-id=${spotId}&get-owner-info=true&auth-key=${credentials.auth_password}`;
        } else {
            url = `/site?site-id=${spotId}`;
        }

        const res = await mayaClient.get(url);
        if (res.Site) {
            commit('update-spot-details', res.Site);
            commit('update-owner-info-details', res.User);
            const spot = {
                Name: res.Site['Name'],
                Lat: res.Site['Lat'],
                Long: res.Site['Long'],
            };
            commit('update-selected-spot', spot);
            commit('update-is-available', res.Site['SlotsAvailable']);
            commit('update-loading', false);
            commit('update-image', res.Site['SiteImages']);
            commit('update-thumbnail-image', res.Site['SiteImageURI']);
            commit('update-title', res.Site['Name']);
        } else {
            throw res.DisplayMsg;
        }
    },

    async updateAvailability({ commit, state }, availableCount) {
        const url = '/owner/update-site';
        state.spotDetails.SlotsAvailable = availableCount;
        await mayaClient.post(url, state.spotDetails);
    },
    
    async updateLastCallDate({ commit, state }, lastCallDate) {
        const url = '/owner/update-site';
        state.spotDetails.LastCallDate = lastCallDate.toISOString();
        await mayaClient.post(url, state.spotDetails);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
