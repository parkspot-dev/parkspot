<template>
  <Wrapper>
    <TemplateTestimonial></TemplateTestimonial>
  </Wrapper>
</template>
<script>
import Wrapper from "../components/extras/Wrapper.vue";
import TemplateTestimonial from "../components/templates/TemplateTestimonial.vue";
export default {
  /**
   * This page is used for development testing purposes.
   */
  name: "Temp",
  components: {
    Wrapper,
    // MoleculeProductCard,
    TemplateTestimonial,
  },
  data() {
    return {};
  },
};
</script>
