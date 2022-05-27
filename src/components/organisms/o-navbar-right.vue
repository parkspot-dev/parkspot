<template>
  <div class="o-navbar-right">
    <div
      v-for="(navlink, i) in navLinks"
      :key="i"
      class="navbar-item has-text-centered"
    >
      <atom-router-link
        class="navlink"
        :text="navlink.text"
        :link="navlink.link"
        @click.native="isClose"
      />
    </div>
  </div>
</template>

<script>
import atomRouterLink from "@/components/atoms/atom-link/atom-router-link.vue";
export default {
  name: "ONavbarRight",
  components: { atomRouterLink },
  data() {
    return {
      navLinks: {
        home: {
          text: "Home",
          link: "Home",
        },
        about: { text: "About", link: "t-about" },
        features: {
          text: "Features",
          link: "features",
        },
        blog: {
          text: "Blog",
          link: "blog",
        },
        requestSpot: {
          text: "Request ParkSpot",
          link: "VOPortal",
        },
        registerSpot: {
          text: "Register Spot",
          link: "SOPortal",
        },
        faq: {
          text: "FAQ",
          link: "Faq",
        },
      },
      button1: "Log In",
      button2: "Sign Up",
    };
  },
  methods: {
    isClose() {
      this.$emit("toggle:close");
    },
  },
};
</script>

<style scoped>
.navlink {
  color: #4a4a4a;
}

.navlink:hover {
  border-bottom: 2px solid var(--secondary-color);
  color: var(--primary-color);
}
.router-link-exact-active {
  border-bottom: 2px solid var(--secondary-color);
  color: var(--secondary-color);
}
</style>
