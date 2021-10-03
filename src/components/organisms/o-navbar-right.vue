<template>
  <div class="o-navbar-right">
    <atom-router-link
      :key="i"
      v-for="(navlink, i) in navLinks"
      class="has-text-weight-bold navbar-item has-text-centered ps_hover"
      :text="navlink.text"
      :link="navlink.link"
    />
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
};
</script>

<style scoped>
.ps_hover:before {
  position: absolute;
  width: 100%;
  height: 2px;
  left: 0px;
  bottom: 0px;
  content: "";
  background: #ffe08a;
  opacity: 0.3;
  transition: all 0.3s;
}
.ps_hover:hover:before {
  height: 100%;
}
.router-link-exact-active {
  border-bottom: 2px solid #0085ad;
  background: #ffe08a;
  color: #0085ad;
}
</style>