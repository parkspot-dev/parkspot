<template>
  <div id="app">
	<PSNavbar />
	<PSMap />
    <MainBanner />
	<Services />
	<PSTeam />
	<PSSites />
	<contact />
	<PSFooter />
  </div>
</template>

<script>
import PSNavbar from './components/PSNavbar.vue';
import MainBanner from './components/MainBanner.vue';
import PSTeam from './components/PSTeam.vue';
import Services from './components/Service.vue';
import contact from './components/Contact.vue';
import PSMap from './components/MapboxSearch.vue';
import PSFooter from './components/PSFooter.vue';
import PSSites from './components/PSSites.vue';
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
	PSSites
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
