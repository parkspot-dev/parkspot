import Home from '@/views/Home.vue'
import Thanks from '@/views/Thanks.vue'
import Faq from '@/views/Faq.vue'
import Terms from '@/views/Terms.vue'
import about from '@/components/templates/t-about.vue'
import features from '@/components/templates/t-features.vue'
import contact from '@/components/templates/t-contact.vue'
import VOPortal from '@/views/new-portal.vue'



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
    path: '/about',
    name: 't-about',
    component: about
  },
  {
    path: '/features',
    name: 't-features',
    component: features
  },
  {
    path: '/contact',
    name: 't-contact',
    component: contact
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
    component: VOPortal
  },
  {
    path: '/terms-and-conditions',
    name: 'Terms',
    component: Terms
  },

  {
    path: '*',
    component: Home
  }
]

