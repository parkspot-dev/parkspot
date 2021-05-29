import Vue from 'vue';
import Buefy from 'buefy';
import App from './App.vue';
import 'buefy/dist/buefy.css';
import router from './router';
import VueResource from 'vue-resource';

import LazyLoadDirective from "./directives/LazyLoadDirective.vue";

import JwPagination from 'jw-vue-pagination';
Vue.component('jw-pagination', JwPagination);


Vue.directive("lazyload", LazyLoadDirective);

Vue.use(VueResource);

Vue.config.productionTip = false;

Vue.use(Buefy);


new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app');
