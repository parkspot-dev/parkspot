<template>
  <div class="section">
    <div class="container">
      <div class="div">{{ count }}</div>
      <m-search-box />
      <!-- <m-loading-page /> -->
    </div>
  </div>
</template>
<script>
import mLoadingPage from "../components/molecules/m-loading-page.vue";
import MSearchBox from "../components/molecules/m-search-box.vue";
export default {
  components: { mLoadingPage, MSearchBox },
  name: "temp",
  computed: {
    count() {
      return this.$store.getters["device/getFlavour"];
    },
  },
};
</script>