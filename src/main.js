import App from './App.vue';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import { createApp } from 'vue';
import router from './router';
import store from './store';

import 'buefy/dist/buefy.css';

const app = createApp(App)

app.use(Buefy);
app.use(router);
app.use(store);
// Vue.config.productionTip = false;

// main app instance created and mounted
// on #app

// const app = new Vue({
//     router,
//     store,
//     created() {
//         AOS.init({
//             // Global settings:
//             offset: 120, // offset (in px) from the original trigger point
//             delay: 0, // values from 0 to 3000, with step 50ms
//             duration: 1500, // values from 0 to 3000, with step 50ms
//             easing: 'ease', // default easing for AOS animations
//             once: true, // whether animation should happen only once - while scrolling down
//             anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
//         });
//     },
//     render: (h) => h(App),
// });
app.mount('#app');
