import Vue from "vue";
import Vuex from "vuex";
import device from "./device";
import blog from "./blog";
import soportal from "./soportal";
import map from "./map";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    device,
    blog,
    soportal,
    map,
  },
});

export default store;
