<template>
  <section class="section">
    <m-features-main-heading
      :featuresButton="'Learn More'"
      :featuresButtonLink="'features'"
    />
  </section>
</template>

<script>
import MFeaturesMainHeading from "../molecules/m-features-main-heading.vue";
export default {
  components: {
    MFeaturesMainHeading,
  },
  name: "t-features",
  data() {
    return {};
  },
};
</script>

<style scoped>
</style>