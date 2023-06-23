import { mayaClient } from '@/services/api';
import { firebase, getDatabase, ref, get, child } from '../../firebase';
// import _ from 'lodash';

const state = {
    spotDetails: null,
    ownerInfoDetails: null,
    isAvailable: false,
    loading: false,
    title: '',
    thumbnail: [],
    images: [],
    userLatLng: { lat: 12.9716, lng: 77.5946 }, // default location if user refused to share its location
};

const getters = {};

const mutations = {
    'update-spot-details'(state, spotDetails) {
        state.spotDetails = spotDetails;
    },

    'update-owner-info-details'(state, ownerInfoDetails) {
        state.ownerInfoDetails = ownerInfoDetails;
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
    'update-user-lat-lng'(state, userLocation) {
        console.log('kjhdsfa');
        state.userLatLng = userLocation;
    },
};

const actions = {
    async getSpotDetails({ commit }, { spotId, isAdmin }) {
        commit('update-loading', true);
        console.log('spotid', spotId);
        let url;
        if (isAdmin) {
            const db = getDatabase(firebase);
            const dbref = ref(db);
            const res = await get(child(dbref, `admin`));
            const credentials = await res.val();
            url = `/site?site-id=${spotId}&get-owner-info=true&auth-key=${credentials.auth_password}`;
        } else {
            url = `/site?site-id=${spotId}`;
        }

        const res = await mayaClient.get(url);
        if (res.Site) {
            commit('update-spot-details', res.Site);
            commit('update-owner-info-details', res.User);
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
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
