<template>
  <Wrapper>
    <OrganismAddressForm></OrganismAddressForm>
  </Wrapper>
</template>
<script>
import Wrapper from "../components/extras/Wrapper.vue";
import OrganismAddressForm from "../components/organisms/OrganismAddressForm.vue";

export default {
  /**
   * This page is used for development testing purposes.
   */
  name: "Temp",
  components: { OrganismAddressForm, Wrapper },
  data() {
    return {};
  },
};
</script>
