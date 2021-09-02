import Vue from 'vue'
import VueRouter from 'vue-router'
import { routes } from './routes.js'

Vue.use(VueRouter)


//router.beforeEach((to, from, next)=>{
//	if(to !== '/' || to != '/faq' || to != '/thanks'){
//		console.log(`route from ${to} to ${from}`)
//		next()
//	}
//	else{
//		next({path: "/"})
//	}
//})
let scrollBehavior = (to, from, savedPosition) => {
  // return desired position
  if (savedPosition) {
    return savedPosition
  } else {
    return { x: 0, y: 0 }
  }
}
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior
})


export default router
