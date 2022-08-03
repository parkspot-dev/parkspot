import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import fbApp from "./FB-App.vue";

// import VueResource from "vue-resource";

import "bulma/css/bulma.css";
import Buefy from "buefy";
import "buefy/dist/buefy.css";
import "./inlcudes/VeeValidate";

Vue.use(Buefy);
// Vue.use(VueResource);

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
