<template>
  <div id="Home">
    <t-map />
    <!-- <o-portal-section /> -->
    <t-about />
    <t-features />
    <t-product />
    <t-testimonials />
    <!-- <t-team /> -->
    <t-contact />
  </div>
</template>
<script>
import TAbout from "@/components/templates/t-about.vue";
import TFeatures from "@/components/templates/t-features.vue";
import TProduct from "@/components/templates/t-product.vue";
// import TTeam from "@/components/templates/t-team.vue";
import TContact from "@/components/templates/t-contact.vue";
import TMap from "@/components/templates/t-map.vue";
import TTestimonials from "../components/templates/t-testimonials.vue";
import OPortalSection from "../components/organisms/o-portal-section.vue";
export default {
  title: "Parkspot",
  name: "Home",
  components: {
    TAbout,
    TFeatures,
    TContact,
    // TTeam,
    TProduct,
    TMap,
    TTestimonials,
    OPortalSection,
  },
};
</script>
<style>
</style>