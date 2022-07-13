import Home from "../views/Home.vue";
import about from "@/components/templates/t-about.vue";
import { firebase, getDatabase, ref, get, child } from "../firebase";

const guardThisRoute = async (to, from, next) => {
  const db = getDatabase(firebase);
  const dbref = ref(db);
  const res = await get(child(dbref, `portal-user`));
  const credentials = await res.val();
  let userNameLocal = localStorage.getItem("searchPortalUser");
  let userNamePwdLocal = localStorage.getItem("searchPortalUserPwd");
  if (
    userNameLocal === credentials.userName &&
    userNamePwdLocal === credentials.password
  ) {
    next();
  } else {
    alert("Invalid username/password");
    userNameLocal = prompt("Enter User Name:");
    userNamePwdLocal = prompt("Enter Password:");
    localStorage.setItem("searchPortalUser", userNameLocal);
    localStorage.setItem("searchPortalUserPwd", userNamePwdLocal);
    next("/search-portal");
  }
};

export const pages = {
  HOME: "/",
  FAQ: "/faq",
  ABOUT: "/about",
  FEATURES: "/features",
  CONTACT: "/contact",
  SRP: "/srp",
  VOPORTAL: "/get-parking-spot",
  SOPORTAL: "/register-parking-spot",
  TERMS: "/terms-and-conditions",
  BLOG: "/blog",
  MAINBLOG: "/blog/:id/:postTitle",
  SEARCHPORTAL: "/search-portal",
  PAYMENTGATEWAY: "/payment/*",
  DISCOVER: "/bangalore/parking-near-*",
  TEMP: "/temp",
  THANK_YOU: "/thank-you",
  ERROR: "/error",
};

export const routes = [
  {
    path: pages.HOME,
    name: "Home",
    component: Home,
    meta: {
      title:
        "Find and Book Parking Spaces Nearby | Bangalore Delhi Mumbai Pune Bengaluru | Parkspot.in",
    },
  },
  {
    path: pages.FAQ,
    name: "Faq",
    component: () => import("@/views/Faq.vue"),
    meta: {
      title: "FAQ's - Get Your All Parking Related Queries be Answered...",
    },
  },

  {
    path: pages.ABOUT,
    name: "t-about",
    component: about,
    meta: {
      title: "ParkSpot | About -  Get Parking Space , Rent Empty Space",
    },
  },
  {
    path: pages.FEATURES,
    name: "features",
    component: () => import("@/views/features.vue"),
    meta: {
      title: "ParkSpot | Features",
    },
  },
  {
    path: pages.CONTACT,
    name: "t-contact",
    component: () => import("@/views/PageContactUs"),
    meta: {
      title: "ParkSpot | Contact Us",
    },
  },
  {
    path: pages.SRP,
    name: "srp",
    component: () => import("@/views/Srp.vue"),
    meta: {
      title: "ParkSpot | Search - ",
    },
  },
  {
    path: pages.VOPORTAL,
    name: "VOPortal",
    component: () => import("@/views/VO-portal.vue"),
    meta: {
      title: "ParkSpot | Get Parking Spot",
    },
  },
  {
    path: pages.SOPORTAL,
    name: "SOPortal",
    component: () => import("@/views/PageSOPortal.vue"),
    meta: {
      title: "ParkSpot | Register Parking Spot",
    },
  },
  {
    path: "/terms-and-conditions",
    name: "Terms",
    component: () => import("@/views/Terms.vue"),
    meta: {
      title: "ParkSpot | Terms & Conditions",
    },
  },
  {
    path: pages.BLOG,
    name: "blog",
    component: () => import("@/views/landing-blog.vue"),
    meta: {
      title: "ParkSpot | Blogs",
    },
  },
  {
    path: pages.MAINBLOG,
    name: "mainBlog",
    component: () => import("@/views/main-blog.vue"),
    meta: {
      title: "ParkSpot | Blogs - ",
    },
  },
  {
    path: pages.SEARCHPORTAL,
    name: "searchPortal",
    component: () => import("@/views/search-portal.vue"),
    meta: {
      title: "ParkSpot | Search Portal",
    },
    beforeEnter: guardThisRoute,
  },
  {
    path: pages.PAYMENTGATEWAY,
    name: "paymentGateway",
    component: () => import("@/views/payment-gateway.vue"),
    meta: {
      title: "Payment | Parkspot.in ",
    },
  },
  // ! it will take " -mara/xyx"
  {
    path: pages.DISCOVER,
    name: "discover",
    component: () => import("@/views/discover-page.vue"),
    meta: {
      title: "Parking Near ",
    },
  },
  {
    path: pages.THANK_YOU,
    name: "thankYou",
    component: () => import("@/views/PageThankYou.vue"),
    meta: {
      title: "Parking Near ",
    },
  },
  {
    path: pages.ERROR,
    name: "error",
    component: () => import("@/views/PageError.vue"),
    meta: {
      title: "Parking Near ",
    },
  },
  // Todo Delete below code before deployment
  {
    path: pages.TEMP,
    name: "temp",
    component: () => import("@/views/temp.vue"),
    meta: {
      title: "Parking Near ",
    },
  },
  {
    path: "*",
    component: Home,
  },
];
