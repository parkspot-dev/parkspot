<template>
  <div class="o-navbar-right">
    <atom-router-link
      class="navbar-item has-text-centered"
      :text="text1"
      :link="link1"
    />
    <atom-router-link
      class="navbar-item has-text-centered"
      :text="text2"
      :link="link2"
    />
    <atom-router-link
      class="navbar-item has-text-centered"
      :text="text3"
      :link="link3"
    />
    <atom-router-link
      class="navbar-item has-text-centered"
      :text="text4"
      :link="link4"
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
      text1: "Home",
      link1: "Home",
      text2: "About",
      link2: "#About",
      text3: "Features",
      link3: "#Features",
      text4: "Blog",
      link4: "EliminateTrafficJam",
      button1: "Log In",
      button2: "Sign Up",
    };
  },
};
</script>