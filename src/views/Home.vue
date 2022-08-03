<template>
  <div id="Home">
    <TemplateHomeBanner @flyToSrp="flyToSrp"></TemplateHomeBanner>
    <TemplateFeatureHome></TemplateFeatureHome>
    <TemplateOurProducts @arrowBtn="onArrowBtn"></TemplateOurProducts>
    <PageAbout></PageAbout>
    <TemplateTestimonial></TemplateTestimonial>
    <TemplateContactUs @contactUs="fireContact"></TemplateContactUs>
    <LoaderModal :isLoading="isLoading"></LoaderModal>
  </div>
</template>
<script>
import TemplateFeatureHome from "@/components/templates/TemplateFeatureHome.vue";
import TemplateContactUs from "../components/templates/TemplateContactUs.vue";
import TemplateHomeBanner from "../components/templates/TemplateHomeBanner.vue";
import TemplateOurProducts from "../components/templates/TemplateOurProducts.vue";
import TemplateTestimonial from "../components/templates/TemplateTestimonial.vue";
import LoaderModal from "../components/extras/LoaderModal.vue";
import PageAbout from "./PageAbout.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Home",
  components: {
    PageAbout,
    TemplateFeatureHome,
    TemplateContactUs,
    TemplateHomeBanner,
    TemplateTestimonial,
    TemplateOurProducts,
    LoaderModal,
  },
  data() {
    return {
      isLoading: false,
    };
  },
  computed: {
    ...mapGetters({
      location: "map/getNewMapCenter",
    }),
  },
  methods: {
    ...mapActions({
      onlyContact: "soportal/onlyContact",
    }),
    async fireContact() {
      try {
        this.isLoading = true;

        await this.onlyContact();

        this.$buefy.toast.open({
          message: "ParkSpot registered successfully!",
          type: "is-success",
          duration: 2000,
        });

        this.$router.push({ name: "thankYou" });
      } catch (error) {
        console.error({ error });

        this.$buefy.toast.open({
          message: `Something went wrong!`,
          type: "is-danger",
          duration: 2000,
        });

        this.$router.push({ name: "Home" });
      }
      this.isLoading = false;
    },
    flyToSrp() {
      this.$router.push({
        name: "srp",
        query: { lat: this.location[1], lng: this.location[0] },
      });
    },
    onArrowBtn() {
      this.$router.push({ name: "t-contact" });
    },
  },
};
</script>
<style></style>
