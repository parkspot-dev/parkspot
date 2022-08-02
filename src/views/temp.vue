<template>
  <TemplateTerms></TemplateTerms>
</template>
<script>
import TemplateTerms from "../components/templates/TemplateTerms.vue";

export default {
  /**
   * This page is used for development testing purposes.
   */
  name: "Temp",
  components: { TemplateTerms },
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
