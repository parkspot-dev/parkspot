<template>
  <div id="app">
	<PSNavbar />
	<PSMap />
    <MainBanner />
	<Services />
	<PSTeam />
	<PSSites />
	<PSAbout />
	<contact />
	<PSFooter />
  </div>
</template>

<script>
import PSNavbar from '@/components/PSNavbar.vue';
import PSFooter from '@/components/PSFooter.vue';
import PSMap from '@/components/MapboxSearch.vue';
import MainBanner from '@/pages/home/components/MainBanner.vue';
import PSTeam from '@/pages/home/components/PSTeam.vue';
import Services from '@/pages/home/components/Service.vue';
import contact from '@/pages/home/components/Contact.vue';
import PSSites from '@/pages/home/components/PSSites.vue';
import PSAbout from '@/pages/home/components/PSAbout.vue';

export default {
  name: 'App',
  components: {
    PSNavbar,
    MainBanner,
	PSTeam,
	Services,
	contact,
	PSMap,
	PSFooter,
	PSSites,
	PSAbout
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
