import { mapBoxClient, mayaClient } from "@/services/api";
import _ from "lodash";

const state = {
  locations: [],
  selectedLocation: null,
  mapConfig: {
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [77.5946, 12.9716], //default bengaluru lat, lng.
    zoom: 12,
  },
  center: null,
  totalPages: 1, // default page number
  srpResults: [],
  paginateSrpResults: [],
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
  getLocWithLatLng(state) {
    return {
      locName: state.selectedLocation,
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
  "update-location"(state, data) {
    state.locations = data;
  },
  "update-selected-location"(state, data) {
    state.selectedLocation = data;
  },
  "update-map-config"(state, data) {
    state.mapConfig.center = data;
    state.center = data;
  },
  "update-total-pages"(state, data) {
    state.totalPages = data;
  },
  "update-srp-results"(state, data) {
    state.srpResults = data;
  },
  "update-map-center"(state, data) {
    state.center = data;
  },
  "update-paginated-srp-data"(state, { from, to }) {
    console.log("paginat", from, to);
    state.paginateSrpResults = [];
    for (let i = from; i < to; i++) {
      state.paginateSrpResults.push(state.srpResults[i]);
    }
  },
};

const actions = {
  async searchLocation({ commit }, query) {
    let token =
      "pk.eyJ1IjoiaWFtZmlhc2NvIiwiYSI6ImNrOWZiankzdjA5d2kzbWp3NGNzNmIwaHAifQ.E2UwYdvpjc6yNoCmBjfTaQ";
    let url = `/geocoding/v5/mapbox.places/${query}.json?access_token=${token}&proximity=77.4977,12.9716`;
    const data = await mapBoxClient.get(url);
    const result = _.get(data, "features", []);
    commit("update-location", result);
  },

  async srpCall({ state, commit }) {
    const data = await mayaClient.get(
      `/search?lat=${state.center[1]}&long=${state.center[0]}&start=20201115t1250&end=20201115t1400`
    );
    if (data && Object.prototype.hasOwnProperty.call(data, "Sites")) {
      commit("update-srp-results", data.Sites);
      commit("update-total-pages", data.Sites.length);
      state.srpResults = data.Sites;
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
