<template>
  <div class="o-navbar-right">
    <atom-router-link
      class="navbar-item has-text-centered ps_hover"
      :text="home"
      :link="hlink"
    />
    <atom-router-link
      class="navbar-item has-text-centered ps_hover"
      :text="about"
      :link="alink"
    />
    <atom-router-link
      class="navbar-item has-text-centered ps_hover"
      :text="feature"
      :link="afeature"
    />
    <atom-router-link
      class="navbar-item has-text-centered ps_hover"
      :text="blog"
      :link="blink"
    />
    <!-- <div class="navbar-item has-text-centered ">
      <atom-button
        class="button is-warning is-rounded has-text-weight-semibold"
        :text="button1"
      />
    </div>
    <div class="navbar-item has-text-centered">
      <atom-button
        class="button  is-rounded has-text-weight-semibold"
        :text="button2"
      />
    </div> -->
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
      home: "Home",
      hlink: "Home",
      about: "About",
      alink: "t-about",
      feature: "Features",
      afeature: "t-features",
      blog: "Blog",
      blink: "EliminateTrafficJam",
      button1: "Log In",
      button2: "Sign Up",
    };
  },
};
</script>

<style scoped>
.ps_hover:hover{
font-weight: bold;
color: #ffdd57;
}
</style>