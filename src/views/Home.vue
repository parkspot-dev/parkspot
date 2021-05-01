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
