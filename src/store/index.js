import Vue from "vue";
import Vuex from "vuex";
import device from "./device";
import blog from "./blog";
import soportal from "./soportal";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    device,
    blog,
    soportal,
  },
});

export default store;
