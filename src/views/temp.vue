<template>
  <div class="section">
    <div class="container">
      <atom-button> </atom-button>
    </div>
  </div>
</template>
<script>
import AtomButton from "../components/atoms/atom-button/atom-button.vue";
import mLoadingPage from "../components/molecules/m-loading-page.vue";
import MSearchBox from "../components/molecules/m-search-box.vue";
export default {
  components: { mLoadingPage, MSearchBox, AtomButton },
  name: "temp",
  computed: {
    count() {
      return this.$store.getters["device/getFlavour"];
    },
  },
};
</script>