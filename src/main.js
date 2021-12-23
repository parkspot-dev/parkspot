import Vue from 'vue';
import App from './App.vue';
import router from './router';
import VueResource from 'vue-resource';
import 'boxicons'
import VueScrollReveal from 'vue-scroll-reveal';
import LazyLoadDirective from "./directives/LazyLoadDirective.vue";
import JwPagination from 'jw-vue-pagination';
import 'bulma/css/bulma.css'
import store from './store'
import ClickOutside from 'vue-click-outside'

import fbApp from './FB-App.vue'


Vue.component('jw-pagination', JwPagination);
Vue.directive("lazyload", LazyLoadDirective);
Vue.directive("ClickOutside", ClickOutside);
Vue.use(VueResource);

Vue.config.productionTip = false;

Vue.use(VueScrollReveal, {
  class: 'v-scroll-reveal', // A CSS class applied to elements with the v-scroll-reveal directive; useful for animation overrides.
  duration: 1000,
  scale: 1,
  distance: '20px',
  mobile: true
})


new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');


// Created the vue instance for fb messenger app
const vm = new Vue({
  render: (h) => h(fbApp)
});

// Some async task that creates a new vue app on the page
setTimeout(() => {
  vm.$mount('#fb-app');
}, 5000)