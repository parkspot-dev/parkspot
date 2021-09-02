<template>
  <div class="m_footer_bottom columns is-mobile">
    <div class="column is-size-7">
      <atom-text :text="text1" />
    </div>
    <div class="column has-text-centered-desktop">
      <atom-router-link :link="link" class="is-size-7" :text="text2" />
    </div>
  </div>
</template>

<script>
import AtomRouterLink from "@/components/atoms/atom-link/atom-router-link.vue";
import atomText from "@/components/atoms/atom-text/atom-text.vue";
export default {
  components: { atomText, AtomRouterLink },
  name: "m-footer-bottom",
  data() {
    return {
      text1: "© 2021 NeoSpot Pvt Ltd.- ALL RIGHTS RESERVED",
      text2: "Terms and Conditions",
      link: "Terms",
    };
  },
};
</script>

<style scoped>
</style>