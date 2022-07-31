<template>
  <TemplateNearBy></TemplateNearBy>
</template>
<script>
import TemplateNearBy from "../components/templates/TemplateNearBy.vue";

export default {
  /**
   * This page is used for development testing purposes.
   */
  name: "Temp",
  components: { TemplateNearBy },
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
