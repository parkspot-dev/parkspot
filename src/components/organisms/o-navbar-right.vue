<template>
  <div class="o-navbar-right">
    <atom-router-link class="navbar-item" :text="text1" :link="link1" />
    <atom-router-link class="navbar-item" :text="text2" :link="link2" />
    <atom-router-link class="navbar-item" :text="text3" :link="link3" />
    <atom-router-link class="navbar-item" :text="text4" :link="link4" />
    <div class="navbar-item">
      <div class="buttons">
        <atom-button class="button" :text="button1" />
        <atom-button class="button" :text="button2" />
      </div>
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
      text1: "Home",
      link1: "Home",
      text2: "About",
      link2: "#About",
      text3: "Features",
      link3: "#Features",
      text4: "Blog",
      link4: "EliminateTrafficJam",
      button1: "Sign Up",
      button2: "Log In",
    };
  },
};
</script>