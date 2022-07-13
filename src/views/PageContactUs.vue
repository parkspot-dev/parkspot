<template>
  <section class="custom-bg">
    <TemplateContactUs></TemplateContactUs>
  </section>
</template>

<script>
import TemplateContactUs from "../components/templates/TemplateContactUs.vue";
export default {
  name: "PageContactUs",
  components: {
    TemplateContactUs,
  },
};
</script>

<style scoped>
.custom-bg {
}
</style>