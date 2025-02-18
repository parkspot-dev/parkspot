import 'aos/dist/aos.css';
import 'buefy/dist/buefy.css';
import 'buefy/dist/buefy.css';
import { configure } from 'vee-validate';
import { createApp } from 'vue';
import AOS from 'aos';
import App from './App.vue';
import Buefy from 'buefy';
import router from './router';
import store from './store';

// Configure vee-validate globally
configure({
    validateOnInput: true
});

const app = createApp(App);

app.use(Buefy);
app.use(router);
app.use(store);

app.mount('#app');

// Initialize AOS after the app is mounted
AOS.init({
    offset: 120,
    delay: 0,
    duration: 1500,
    easing: 'ease',
    once: true,
    anchorPlacement: 'top-bottom',
});
