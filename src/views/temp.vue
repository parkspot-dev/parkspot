<template>
  <TemplateFeatureHome></TemplateFeatureHome>
</template>
<script>
import TemplateFeatureHome from "../components/templates/TemplateFeatureHome.vue";

export default {
  /**
   * This page is used for development testing purposes.
   */
  name: "Temp",
  components: { TemplateFeatureHome },
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
