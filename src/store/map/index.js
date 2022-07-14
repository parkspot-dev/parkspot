import { mapBoxClient } from "@/services/api";
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
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
