import Home from '@/views/Home.vue'
import Thanks from '@/views/Thanks.vue'
import Faq from '@/views/Faq.vue'
// import PSSrp from '@/views/Srp.vue'
// import Blog1 from '@/views/Blog1.vue'
// delete it after portal testing
// import Portal from '@/views/Portal.vue'
// import Parking from '@/views/Parking.vue'
// import PSTemplate from '@/pages/Parking/components/PSTemplate.vue'


export const routes = [
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
  	path: '/srp',
		name: 'PSSrp',
    //() => import('@/views/Srp.vue') is dynamic import , it is only get loaded when the route is loaded
		component: () => import('@/views/Srp.vue')
	},
	{
		path: '/blog/eliminating-reason-for-traffic-jam',
		name: 'EliminateTrafficJam',
		component: () => import('@/views/Blog1.vue')
	},
  // delete
  {
    path: '/portal',
		name: 'PSPortal',
		component: () => import('@/views/Portal.vue')
  },
  {
    path: '/parkspot-near-you',
		name: 'Parking',
		component: () => import('@/views/Parking.vue')
  },
  {
    path: '/parkspot-near-you/:id',
		name: 'PSTemplate',
		component: () => import('@/pages/Parking/components/PSTemplate.vue'),
    props: true
  },
  
  // delete above
  {
  path: '*',
	beforeRouteEnter: (to, from, next)=>{
		console.log(`route from ${to} to ${from}`)
		next('/')
	},
	component: Home
  }
]

