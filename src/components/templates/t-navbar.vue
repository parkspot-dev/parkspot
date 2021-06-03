<template>
  <nav class="navbar is-transparent" role="navigation" aria-label="main navigation">
    <div class="container">
      <div class="navbar-brand">
      <o-navbar-left class="navbar-item"/>
      
      <a
        role="button"
        class="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="ps__navbar"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="ps__navbar" class="navbar-menu is-active">
      <div class="navbar-start"></div>
      <o-navbar-right class="navbar-end"/>
    </div>
    </div>
  </nav>
</template>
 


<script>
import ONavbarLeft from "@/components/organisms/o-navbar-left.vue";
import AtomRouterLink from "../atoms/atom-link/atom-router-link.vue";
import ONavbarRight from '../organisms/o-navbar-right.vue';
export default {
  components: { ONavbarLeft, AtomRouterLink, ONavbarRight , },
  name: "t-navbar",
};
   
</script>

<style scoped>
</style>