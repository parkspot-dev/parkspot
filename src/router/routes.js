import Home from '@/views/Home.vue'
import Thanks from '@/views/Thanks.vue'
import about from '@/components/templates/t-about.vue'



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
    component: () => import('@/views/Faq.vue')
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
    path: '/about',
    name: 't-about',
    component: about
  },
  {
    path: '/features',
    name: 't-features',
    component: () => ('@/components/templates/t-features.vue')
  },
  {
    path: '/contact',
    name: 't-contact',
    component: () => import('@/components/templates/t-contact.vue')
  },
  {
    path: '/srp',
    name: 'srp',
    // beforeRouteUpdate(to, from, next) {
    //   // react to route changes...
    //   console.log(`to ${to} from ${from}`)
    //   // don't forget to call next()
    //   next()
    // },
    component: () => import('@/views/Srp.vue')
  },
  {
    path: '/blog/eliminating-reason-for-traffic-jam',
    name: 'EliminateTrafficJam',
    component: () => import('@/views/Blog1.vue')
  },
  // delete
  {
    path: '/request-your-parking-spot',
    name: 'VOPortal',
    component: () => import('@/views/new-portal.vue')
  },
  {
    path: '/terms-and-conditions',
    name: 'Terms',
    component: () => import('@/views/Terms.vue')
  },

  {
    path: '*',
    component: Home
  }
]

