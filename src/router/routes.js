import Home from '../views/Home.vue'
import about from '@/components/templates/t-about.vue'
import { firebase, getDatabase, ref, get, child } from "../firebase";

const guardThisRoute = async (to, from, next) => {
  const db = getDatabase(firebase);
  const dbref = ref(db);
  const res = await get(child(dbref, `portal-user`));
  const credentials = await res.val();
  let userName = prompt("Enter User Name:");
  let password = prompt("Enter Password:");
  if (userName === credentials.userName && password === credentials.password) {
    next()
  } else {
    alert("Invalid username/password")
    next('/search-portal')
  }

}


export const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: "Find and Book Parking Spaces Nearby | Bangalore Delhi Mumbai Pune Bengaluru | Parkspot.in"
    }
  },
  {
    path: '/faq',
    name: 'Faq',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('@/views/Faq.vue'),
    meta: {
      title: "FAQ's - Get Your All Parking Related Queries be Answered..."
    }
  },

  {
    path: '/about',
    name: 't-about',
    component: about,
    meta: {
      title: "ParkSpot | About -  Get Parking Space , Rent Empty Space"
    }
  },
  {
    path: '/features',
    name: 't-features',
    component: () => import('@/components/templates/t-features.vue'), meta: {
      title: "ParkSpot | Features"
    }
  },
  {
    path: '/contact',
    name: 't-contact',
    component: () => import('@/components/templates/t-contact.vue'),
    meta: {
      title: "ParkSpot | Contact Us"
    }
  },
  {
    path: '/srp',
    name: 'srp',
    component: () => import('@/views/Srp.vue'),
    meta: {
      title: "ParkSpot | Search - "
    }
  },
  {
    path: '/get-parking-spot',
    name: 'VOPortal',
    component: () => import('@/views/VO-portal.vue'),
    meta: {
      title: "ParkSpot | Get Parking Spot"
    }
  },
  {
    path: '/terms-and-conditions',
    name: 'Terms',
    component: () => import('@/views/Terms.vue'),
    meta: {
      title: "ParkSpot | Terms & Conditions"
    }
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('@/views/landing-blog.vue'),
    meta: {
      title: "ParkSpot | Blogs"
    }
  },
  {
    path: '/blog/:id/:postTitle',
    name: 'mainBlog',
    component: () => import('@/views/main-blog.vue'),
    // props: (route) => ({
    //   data: userData,
    // })
    meta: {
      title: "ParkSpot | Blogs - "
    }
  },
  {
    path: '/search-portal',
    name: 'searchPortal',
    component: () => import('@/views/search-portal.vue'),
    meta: {
      title: "ParkSpot | Search Portal"
    },
    beforeEnter: guardThisRoute
  },
  {
    path: '/payment/*',
    name: 'paymentGateway',
    component: () => import('@/views/payment-gateway.vue'),
    meta: {
      title: "Payment | Parkspot.in "
    }
  },
  // ! it will take " -mara/xyx"
  {
    path: '/bangalore/parking-near-*',
    name: 'discover',
    component: () => import('@/views/discover-page.vue'),
    meta: {
      title: "Parking Near "
    }
  },
  // Todo Delete below code before deployment
  // {
  //   path: '/temp',
  //   name: 'temp',
  //   component: () => import('@/views/temp.vue'),
  //   meta: {
  //     title: "Parking Near "
  //   }
  // },

  {
    path: '*',
    component: Home
  }
]

