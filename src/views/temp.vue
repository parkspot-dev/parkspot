<template>
  <PagePaymentGateway></PagePaymentGateway>
</template>
<script>
import PagePaymentGateway from "./PagePaymentGateway.vue";

export default {
  /**
   * This page is used for development testing purposes.
   */
  name: "TempPage",
  components: {
    PagePaymentGateway,
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
.custom-wrapper {
  max-width: 960px;
  margin: auto;
}
</style>
