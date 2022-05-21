<template>
  <nav
    class="navbar is-transparent"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="container">
      <div class="navbar-brand">
        <o-navbar-left class="navbar-item" />

        <a
          role="button"
          class="navbar-burger"
          :class="{ 'is-active': toggle }"
          aria-label="menu"
          aria-expanded="false"
          data-target="ps__navbar"
          @click="isToggle"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="ps__navbar" class="navbar-menu" :class="{ 'is-active': toggle }">
        <div class="navbar-start"></div>
        <o-navbar-right class="navbar-end" @toggle:close="isClose" />
      </div>
    </div>
  </nav>
</template>

<script>
import ONavbarLeft from "@/components/organisms/o-navbar-left.vue";
import ONavbarRight from "@/components/organisms/o-navbar-right.vue";
export default {
  name: "TNavbar",
  components: { ONavbarLeft, ONavbarRight },
  data() {
    return {
      toggle: false,
    };
  },
  methods: {
    isToggle() {
      this.toggle = !this.toggle;
    },
    isClose() {
      this.isToggle();
    },
  },
};
</script>

<style scoped></style>
