<template>
  <Wrapper>
    <OrganismAddressForm></OrganismAddressForm>
    <OrganismContactForm :textArea="true"></OrganismContactForm>
  </Wrapper>
</template>
<script>
import Wrapper from "../components/extras/Wrapper.vue";
import OrganismAddressForm from "../components/organisms/OrganismAddressForm.vue";
import OrganismContactForm from "../components/organisms/OrganismContactForm.vue";

export default {
  /**
   * This page is used for development testing purposes.
   */
  name: "Temp",
  components: { OrganismAddressForm, Wrapper, OrganismContactForm },
  data() {
    return {};
  },
};
</script>
