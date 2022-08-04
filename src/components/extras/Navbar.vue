<template>
  <header>
    <b-navbar class="is-spaced has-shadow" fixed-top>
      <template #brand>
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <img :src="parkspotIcon" alt="parkspot icon" />
          <img :src="parkspotText" alt="parkspot text" />
        </b-navbar-item>
      </template>

      <template #end>
        <b-navbar-item tag="router-link" :to="{ name: 'Home' }">
          Home
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ name: 't-about' }">
          About
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ name: 'features' }">
          Features
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ name: 'blog' }">
          Blog
        </b-navbar-item>
        <b-navbar-dropdown label="Service" hoverable>
          <b-navbar-item tag="router-link" :to="{ name: 'VOPortal' }">
            Request Spot
          </b-navbar-item>
          <b-navbar-item tag="router-link" :to="{ name: 'SOPortal' }">
            Register Spot
          </b-navbar-item>
        </b-navbar-dropdown>
        <b-navbar-item tag="router-link" :to="{ name: 'Faq' }">
          Faq
        </b-navbar-item>
      </template>
    </b-navbar>
  </header>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      parkspotIcon: require("@/assets/pstopmini.png"),
      parkspotText: require("@/assets/pstoptext.png"),
    };
  },
};
</script>

<style scoped>
.nav-wrapper {
  max-width: 1200px;
}
.navbar-item img {
  max-height: 2rem;
}
.navbar-item:hover,
.router-link-active:hover,
.router-link-exact-active:hover {
  color: var(--secondary-color);
}

.router-link-exact-active:visited {
  color: var(--secondary-color);
}
</style>
