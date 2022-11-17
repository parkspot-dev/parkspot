import { mayaClient } from '@/services/api';
// import _ from 'lodash';

const state = {
    spotDetails: null,
    userLocation: null,
};

const getters = {};

const mutations = {
    'update-spot-details'(state, spotDetails) {
        state.spotDetails = spotDetails;
        console.log(state.spotDetails);
    },

    'update-user-location'(state, location) {
        state.userLocation = location;
    },
};

const actions = {
    async getSpotDetails({ commit }, spotId) {
        const res = await mayaClient.get(
            `/site?siteID=${spotId}&getOwnerInfo=false`,
        );
        commit('update-spot-details', res.Site);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
