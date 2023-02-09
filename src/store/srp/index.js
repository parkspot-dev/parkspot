import { mayaClient } from '@/services/api';
// import _ from 'lodash';

const state = {
    spotDetails: null,
    selectedSpot: [],
};

const getters = {};

const mutations = {
    'update-spot-details'(state, spotDetails) {
        state.spotDetails = spotDetails;
        console.log(state.spotDetails);
    },

    'update-selected-spot'(state, spot) {
        state.selectedSpot = [];
        state.selectedSpot = [...state.selectedSpot, spot];
    },
};

const actions = {
    async getSpotDetails({ commit }, spotId) {
        const res = await mayaClient.get(
            `/site?siteID=${spotId}&getOwnerInfo=false`,
        );
        commit('update-spot-details', res.Site);
        const spot = {
            Name: res.Site['Name'],
            Lat: res.Site['Latitude'],
            Long: res.Site['Longitude'],
        };
        commit('update-selected-spot', spot);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
