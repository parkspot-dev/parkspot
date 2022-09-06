import Vue from 'vue';
import Vuex from 'vuex';
import device from './device';
import blog from './blog';
import user from './user';
import map from './map';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    device,
    blog,
    user,
    map,
  },
});

export default store;
