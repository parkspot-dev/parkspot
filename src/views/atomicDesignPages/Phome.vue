<template>
  <div id="home">
    <t-navbar />
    <t-map v-scroll-reveal.reset />
    <t-about v-scroll-reveal.reset />
    <t-features v-scroll-reveal.reset />
    <t-product v-scroll-reveal.reset />
    <t-team v-scroll-reveal.reset />
    <t-contact v-scroll-reveal.reset />
    <t-footer  />
  </div>
</template>
<script>
import TFooter from "@/components/templates/t-footer.vue";
import TNavbar from "@/components/templates/t-navbar.vue";
import TAbout from "@/components/templates/t-about.vue";
import TFeatures from "@/components/templates/t.features.vue";
import TProduct from "@/components/templates/t-product.vue";
import TTeam from "@/components/templates/t-team.vue";
import TContact from "@/components/templates/t-contact.vue";
import TMap from "@/components/templates/t-map.vue";
export default {
  name: "Home",
  components: {
    TFooter,
    TNavbar,
    TAbout,
    TFeatures,
    TContact,
    TTeam,
    TProduct,
    TMap,
  },
};
</script>
<style>
</style>