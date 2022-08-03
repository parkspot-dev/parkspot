<template>
  <TemplateInventory></TemplateInventory>
</template>
<script>
import TemplateInventory from "../components/templates/TemplateInventory.vue";

export default {
  /**
   * This page is used for development testing purposes.
   */
  name: "Temp",
  components: { TemplateInventory },
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
