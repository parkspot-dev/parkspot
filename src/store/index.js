import Vue from "vue";
import Vuex from "vuex";
import device from "./modules/device";
import blog from "./modules/blog";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    device,
    blog,
  },
});

export default store;
