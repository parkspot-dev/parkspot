import { routes } from './routes.js';
import { createRouter, createWebHistory } from 'vue-router';

const scrollBehavior = (_to, _from, savedPosition) => {
    // initially "savedPosition" value will be null,
    // coming back from page2 to page1 it will contain
    // the last co-ordinate of page1.
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: "smooth" };
    }
};

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior,
});

export default router;