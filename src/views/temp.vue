<template>
  <div class="section">
    <div class="container">
      <div class="div">{{ count }}</div>
      <m-loading-page />
    </div>
  </div>
</template>
<script>
import mLoadingPage from "../components/molecules/m-loading-page.vue";
export default {
  components: { mLoadingPage },
  name: "temp",
  computed: {
    count() {
      return this.$store.getters["device/getFlavour"];
    },
  },
};
</script>