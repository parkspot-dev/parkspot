// import { mayaClient } from '@/services/api';
// import _ from 'lodash';

const state = {
    activeTab: 0,
    SOLatLngInput: '',
};

const getters = {};

const mutations = {
    'update-active-tab'(state, tabNo) {
        state.activeTab = tabNo;
    },
    'update-SO-Lat-Lng-Input'(state, latLng) {
        state.SOLatLngInput = latLng;
    },
};

const actions = {
    updateActiveTab({ commit }, tabNo) {
        commit('update-active-tab', tabNo);
    },
    updateSOLatLngInput({ commit }, latLng) {
        commit('update-SO-Lat-Lng-Input', latLng);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
