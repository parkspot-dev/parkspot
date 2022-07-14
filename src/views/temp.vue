<template>
  <Wrapper>
    <!-- <MoleculeProductCard></MoleculeProductCard> -->
    <TemplateOurProducts></TemplateOurProducts>
  </Wrapper>
</template>
<script>
import TemplateOurProducts from "../components/templates/TemplateOurProducts.vue";
// import MoleculeProductCard from "../components/molecules/MoleculeProductCard.vue";
import Wrapper from "../components/extras/Wrapper.vue";
export default {
  /**
   * This page is used for development testing purposes.
   */
  name: "Temp",
  components: {
    TemplateOurProducts,
    Wrapper,
    // MoleculeProductCard,
  },
  data() {
    return {};
  },
};
</script>
