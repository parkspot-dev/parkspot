import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import fbApp from "./FB-App.vue";

import VueResource from "vue-resource";
import "boxicons";
import VueScrollReveal from "vue-scroll-reveal";
import LazyLoadDirective from "./directives/LazyLoadDirective.vue";
import JwPagination from "jw-vue-pagination";

import "bulma/css/bulma.css";
import ClickOutside from "vue-click-outside";
import Buefy from "buefy";
import "buefy/dist/buefy.css";
import "./inlcudes/VeeValidate";

Vue.use(Buefy);
Vue.use(VueResource);
Vue.use(VueScrollReveal, {
  // A CSS class applied to elements with the
  // v-scroll-reveal directive; useful for animation overrides.
  class: "v-scroll-reveal",
  duration: 1000,
  scale: 1,
  distance: "20px",
  mobile: true,
});

Vue.component("jw-pagination", JwPagination);

Vue.directive("lazyload", LazyLoadDirective);
Vue.directive("ClickOutside", ClickOutside);

Vue.config.productionTip = false;

// main app instance created and mounted
// on #app
const app = new Vue({
  router,
  store,
  render: (h) => h(App),
});
app.$mount("#app");

// fb chat app created and mounted via
// async call with 5 sec after the main app
const fb = new Vue({
  render: (h) => h(fbApp),
});

setTimeout(() => {
  fb.$mount("#fb-app");
}, 5000);
