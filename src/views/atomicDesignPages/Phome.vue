<template>
  <div id="home">
    <t-navbar />
    <t-map/>
    <t-about  />
    <t-features  />
    <t-product  />
    <t-team  />
    <t-contact  />
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