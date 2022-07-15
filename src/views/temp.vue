<template>
  <Wrapper>
    <AtomRating :rate="4.4"></AtomRating>
  </Wrapper>
</template>
<script>
import Wrapper from "../components/extras/Wrapper.vue";
import AtomRating from "../components/atoms/AtomRating.vue";
export default {
  /**
   * This page is used for development testing purposes.
   */
  name: "Temp",
  components: {
    Wrapper,
    // MoleculeProductCard,
    AtomRating,
  },
  data() {
    return {};
  },
};
</script>
