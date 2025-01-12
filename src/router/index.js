import Vue from 'vue';
import VueRouter, { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes.js';

Vue.use(VueRouter);

const scrollBehavior = (_to, _from, savedPosition) => {
    // initially "savedPosition" value will be null,
    // coming back from page2 to page1 it will contain
    // the last co-ordinate of page1.
    if (savedPosition) {
        return { savedPosition, behavior: 'smooth' };
    } else {
        return { x: 0, y: 0, behavior: 'smooth' };
    }
};

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior,
});

export default router;
