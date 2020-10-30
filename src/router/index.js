import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Thanks from '@/views/Thanks.vue'
import Faq from '@/views/Faq.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/faq',
    name: 'Faq',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Faq
  },
  {
    path: '/thanks',
    name: 'Thanks',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Thanks
  },
  {
  	path: '*',
	beforeRouteEnter: (to, from, next)=>{
		console.log(`route from ${to} to ${from}`)
		next('/')
	},
	component: Home
  }
]

const router = new VueRouter({
  mode: 'history',
  base: "/",
  routes
})

router.beforeEach((to, from, next)=>{
	if(to !== '/' || to != '/faq' || to != '/thanks'){
		console.log(`route from ${to} to ${from}`)
		next()
	}
	else{
		next({path: "/"})
	}
})
export default router
