<template>
  <div id="app">
    
    <PSNavbar />
	
    <PSMap />
    <LazyHydrate when-visible>
      <MainBanner />
    </LazyHydrate>
    <LazyHydrate when-visible>
      <Services />
    </LazyHydrate>
    <LazyHydrate when-visible>
      <PSTeam />
    </LazyHydrate>
    <LazyHydrate when-visible>
      <PSOffering />
    </LazyHydrate>
    <LazyHydrate when-visible>
      <PSSites />
    </LazyHydrate>
    <LazyHydrate when-visible>
      <PSAbout />
    </LazyHydrate>
    <LazyHydrate when-visible>
      <contact />
    </LazyHydrate>
    <LazyHydrate when-visible>
      <PSFooter />
    </LazyHydrate>
  </div>
</template>

<script>
import PSNavbar from "@/components/PSNavbar.vue";
import PSMap from "@/components/MapboxSearch.vue";
// import PSFooter from "@/components/PSFooter.vue";
// import MainBanner from "@/pages/home/components/MainBanner.vue";
// import PSTeam from "@/pages/home/components/PSTeam.vue";
// import Services from "@/pages/home/components/Service.vue";
// import contact from "@/pages/home/components/Contact.vue";
// import PSSites from "@/pages/home/components/PSSites.vue";
// import PSAbout from "@/pages/home/components/PSAbout.vue";
// import PSOffering from "@/pages/home/components/PSOffering.vue";
import LazyHydrate from "vue-lazy-hydration";

export default {
  name: "App",
  components: {
    LazyHydrate,
    PSNavbar,
    PSMap,

    MainBanner: () => import("@/pages/home/components/MainBanner.vue"),
    PSTeam: () => import("@/pages/home/components/PSTeam.vue"),
    Services: () => import("@/pages/home/components/Service.vue"),
    contact: () => import("@/pages/home/components/Contact.vue"),
    PSFooter: () => import("@/components/PSFooter.vue"),
    PSSites: () => import("@/pages/home/components/PSSites.vue"),
    PSAbout: () => import("@/pages/home/components/PSAbout.vue"),
    PSOffering: () => import("@/pages/home/components/PSOffering.vue"),
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
