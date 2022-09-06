import Vue from 'vue';
import VueRouter from 'vue-router';
import { routes } from './routes.js';

Vue.use(VueRouter);

const scrollBehavior = (to, from, savedPosition) => {
  // initially "savedPosition" value will be null,
  // coming back from page2 to page1 it will contain
  // the last co-ordinate of page1.
  if (savedPosition) {
    return { savedPosition, behavior: 'smooth' };
  } else {
    return { x: 0, y: 0, behavior: 'smooth' };
  }
};

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior,
});

router.beforeEach((to, from, next) => {
  if (to.name === 'mainBlog') {
    document.title = `${to.meta.title}  
    ${to.params.id}`;
  } else if (to.name === 'srp') {
    document.title = `${to.meta.title} ${to.params.location || ''}`;
  } else if (to.name === 'discover') {
    document.title = `${to.meta.title} 
    ${to.params.pathMatch.replace(/b*\//, '')} 
    - Find and Book Best Parking Spot with ParkSpot`;
  } else {
    document.title = `${to.meta.title} `;
  }
  next();
});

export default router;
