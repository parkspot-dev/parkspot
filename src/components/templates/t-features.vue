<template>
  <section class="section">
    <div class="container">
      <m-features-main-heading
        :features-button="'Learn More'"
        :features-button-link="'features'"
      />
    </div>
  </section>
</template>

<script>
import MFeaturesMainHeading from "../molecules/m-features-main-heading.vue";
export default {
  name: "TFeatures",
  components: {
    MFeaturesMainHeading,
  },
  data() {
    return {};
  },
};
</script>

<style scoped></style>
