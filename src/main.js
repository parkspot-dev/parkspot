import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import fbApp from './FB-App.vue';

import 'bulma/css/bulma.css';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import './includes/VeeValidate';
import AOS from 'aos';
import 'aos/dist/aos.css';
import VueMeta from 'vue-meta';

Vue.use(VueMeta);
Vue.use(Buefy);
Vue.config.productionTip = false;

// main app instance created and mounted
// on #app
const app = new Vue({
    router,
    store,
    created() {
        AOS.init({
            // Global settings:
            offset: 120, // offset (in px) from the original trigger point
            delay: 0, // values from 0 to 3000, with step 50ms
            duration: 1500, // values from 0 to 3000, with step 50ms
            easing: 'ease', // default easing for AOS animations
            once: true, // whether animation should happen only once - while scrolling down
            anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
        });
    },
    render: (h) => h(App),
});
app.$mount('#app');

// fb chat app created and mounted via
// async call with 5 sec after the main app
const fb = new Vue({
    render: (h) => h(fbApp),
});

setTimeout(() => {
    fb.$mount('#fb-app');
}, 5000);
