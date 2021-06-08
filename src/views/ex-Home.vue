<template>
  <div id="app">
    <PSNavbar />
    <PSMap />

    <MainBanner />
    <Services />
    <PSTeam />
    <PSOffering />
    <PSSites />
    <PSAbout />
    <contact />
  </div>
</template>

<script>
import PSNavbar from "@/components/PSNavbar.vue";
import PSMap from "@/components/MapboxSearch.vue";

export default {
  name: "App",
  data() {
    return {
      isTerm: false,
    };
  },
  components: {
    PSNavbar,
    PSMap,
    MainBanner: () => import("@/pages/home/components/MainBanner.vue"),
    PSTeam: () => import("@/pages/home/components/PSTeam.vue"),
    Services: () => import("@/pages/home/components/Service.vue"),
    contact: () => import("@/pages/home/components/Contact.vue"),
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
