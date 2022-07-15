<template>
  <Wrapper> <TemplateFaq></TemplateFaq> </Wrapper>
</template>
<script>
import Wrapper from "../components/extras/Wrapper.vue";
import TemplateFaq from "../components/templates/TemplateFaq.vue";
export default {
  /**
   * This page is used for development testing purposes.
   */
  name: "Temp",
  components: {
    Wrapper,
    // MoleculeProductCard,
    TemplateFaq,
  },
  data() {
    return {};
  },
};
</script>
