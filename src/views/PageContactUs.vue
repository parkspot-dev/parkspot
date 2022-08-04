<template>
  <div class="bg-wrap">
    <TemplateContactUs @contactUs="fireContact"></TemplateContactUs>
    <LoaderModal :isLoading="isLoading"></LoaderModal>
  </div>
</template>

<script>
import TemplateContactUs from "../components/templates/TemplateContactUs.vue";
import LoaderModal from "../components/extras/LoaderModal.vue";
import { mapActions } from "vuex";
export default {
  name: "PageContactUs",
  components: {
    TemplateContactUs,
    LoaderModal,
  },
  data() {
    return {
      isLoading: false,
    };
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
  },
};
</script>

<style scoped>
.bg-wrap {
  background-color: var(--bg-color-secondary);
  position: relative;
}
.bg-wrap:before {
  content: "";
  display: block;
  width: calc(50vw + 150px);
  height: 100%;
  background-color: #171c37;
  -webkit-clip-path: polygon(300px 0, 100% 0, 100% 100%, 0 100%);
  clip-path: polygon(300px 0, 100% 0, 100% 100%, 0 100%);
  position: absolute;
  top: 0;
  right: 0;
}
</style>
