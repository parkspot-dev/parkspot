<template>
  <div id="Home">
    <!-- <t-map /> -->
    <!-- <o-portal-section /> -->
    <TemplateHomeBanner></TemplateHomeBanner>
    <t-about />
    <t-features />
    <t-product />
    <t-testimonials />
    <!-- <t-team /> -->
    <!-- <t-contact /> -->
    <TemplateContactUs></TemplateContactUs>
  </div>
</template>
<script>
import TAbout from "@/components/templates/t-about.vue";
import TFeatures from "@/components/templates/t-features.vue";
import TProduct from "@/components/templates/t-product.vue";
// import TTeam from "@/components/templates/t-team.vue";
// import TContact from "@/components/templates/t-contact.vue";
// import TMap from "@/components/templates/t-map.vue";
import TTestimonials from "../components/templates/t-testimonials.vue";
import TemplateContactUs from "../components/templates/TemplateContactUs.vue";
import TemplateHomeBanner from "../components/templates/TemplateHomeBanner.vue";
export default {
  name: "Home",
  components: {
    TAbout,
    TFeatures,
    // TContact,
    TemplateContactUs,
    TemplateHomeBanner,
    // TTeam,
    TProduct,
    // TMap,
    TTestimonials,
  },
};
</script>
<style></style>
