<template>
  <section class="custom-bg">
    <TemplateVOPortal @finalSubmit="onFinalSubmit"></TemplateVOPortal>
    <LoaderModal :isLoading="isLoading"></LoaderModal>
  </section>
</template>

<script>
import TemplateVOPortal from "../components/templates/TemplateVOPortal.vue";
import LoaderModal from "../components/extras/LoaderModal.vue";
import { mapActions } from "vuex";
export default {
  name: "PageVOPortal",
  components: {
    TemplateVOPortal,
    LoaderModal,
  },
  data() {
    return {
      isLoading: false,
    };
  },
  methods: {
    ...mapActions({
      register: "soportal/register",
      login: "soportal/login",
      kyc: "soportal/kyc",
      contact: "soportal/contact",
    }),
    async onFinalSubmit() {
      try {
        this.isLoading = true;
        await this.register();
        await this.login();
        await this.kyc();
        await this.contact(); // todo contact can be fired in parallel
        this.isLoading = false;
        this.$buefy.toast.open({
          message: "ParkSpot registered successfully!",
          type: "is-success",
          duration: 2000,
        });
        this.$router.push({ name: "Home" });
      } catch (error) {
        console.error({ error });
        this.$buefy.toast.open({
          message: `Something went wrong!`,
          type: "is-danger",
          duration: 2000,
        });
        this.$router.push({ name: "SOPortal" });
      }
    },
  },
};
</script>

<style scoped>
.custom-bg {
  background-color: #ecf0f1;
}
</style>
