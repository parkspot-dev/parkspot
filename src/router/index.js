import Vue from "vue";
import VueRouter from "vue-router";
import { routes } from "./routes.js";

Vue.use(VueRouter);

let scrollBehavior = (to, from, savedPosition) => {
  // initially "savedPosition" value will be null,
  // coming back from page2 to page1 it will contain
  // the last co-ordinate of page1.
  if (savedPosition) {
    return savedPosition;
  } else {
    return { x: 0, y: 0 };
  }
};

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior,
});

router.beforeEach((to, from, next) => {
  if (to.name === "mainBlog") {
    document.title = `${to.meta.title}  
    ${to.params.postTitle.replace(/-/g, " ")}`;
  } else if (to.name === "srp") {
    document.title = `${to.meta.title} ${to.query.loc}`;
  } else if (to.name === "discover") {
    document.title = `${to.meta.title} 
    ${to.params.pathMatch.replace(/b*\//, "")} 
    - Find and Book Best Parking Spot with ParkSpot`;
  } else {
    document.title = `${to.meta.title} `;
  }
  next();
});

export default router;
