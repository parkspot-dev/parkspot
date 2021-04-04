import Vue from 'vue';
import Buefy from 'buefy';
import App from './App.vue';
import 'buefy/dist/buefy.css';
import router from './router';
import VueResource from 'vue-resource';

Vue.use(VueResource);

Vue.config.productionTip = false;

Vue.use(Buefy);


new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app');
