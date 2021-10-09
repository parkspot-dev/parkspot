<template>
  <div class="o-navbar-right">
    <div
      class="navbar-item has-text-centered"
      :key="i"
      v-for="(navlink, i) in navLinks"
    >
      <atom-router-link
        class="has-text-weight-bold navlink"
        :text="navlink.text"
        :link="navlink.link"
        v-on:click.native="isClose"
      />
    </div>
  </div>
</template>

<script>
import atomRouterLink from "@/components/atoms/atom-link/atom-router-link.vue";
import AtomButton from "@/components/atoms/atom-button/atom-button.vue";
export default {
  components: { atomRouterLink, AtomButton },
  name: "o-navbar-right",
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
          link: "t-features",
        },
        blog: {
          text: "Blog",
          link: "blog",
        },
        requestSpot: {
          text: "Request ParkSpot",
          link: "VOPortal",
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
/* .o-navbar-right {
  padding: 35px 0 35px;
} */
.navlink {
  color: #4a4a4a;
}
.navlink:hover {
  border-bottom: 2px solid #0085ad;
  color: #ffe08a;
}
.router-link-exact-active {
  border-bottom: 2px solid #0085ad;
  /* background: #ffe08a; */
  color: #0085ad;
}
</style>