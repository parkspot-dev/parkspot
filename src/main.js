import 'aos/dist/aos.css';
import 'buefy/dist/buefy.css';
import 'buefy/dist/buefy.css';
import { configure } from 'vee-validate';
import { createApp } from 'vue';
import { createHead } from '@unhead/vue';
import AOS from 'aos';
import App from './App.vue';
import Buefy from 'buefy';
import router from './router';
import store from './store';
import { metaInfoBridge } from './plugins/unhead-meta-adapter.js';
import { cleanupEdgeInjectedStructuredData } from './plugins/edge-seo-handoff.js';

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

// Configure vee-validate globally
configure({
    validateOnInput: true
});

const app = createApp(App);

app.component('VueDatePicker', VueDatePicker);

app.use(Buefy);
app.use(router);
app.use(store);

// @unhead/vue replaces the Vue-2-only vue-meta package. The bridge mixin
// preserves the existing `metaInfo()` convention across every view so we
// get reactive <head> updates on SPA navigation without rewriting each
// component.
const head = createHead();
app.use(head);
app.mixin(metaInfoBridge);

// Remove the JSON-LD block the edge function injected on the initial HTML
// response before the client-side head manager adds its own. Title / meta
// / canonical already dedupe via @unhead's built-in keys.
cleanupEdgeInjectedStructuredData();

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
