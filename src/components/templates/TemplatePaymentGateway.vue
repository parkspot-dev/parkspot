<template>
  <Wrapper>
    <MoleculePaymentCard
      :bookingDetails="bookingDetails"
      :paymentMode="paymentMode"
    ></MoleculePaymentCard>
  </Wrapper>
</template>

<script>
import Wrapper from "../extras/Wrapper.vue";
import MoleculePaymentCard from "../molecules/MoleculePaymentCard.vue";
export default {
  name: "TemplatePaymentGateway",
  components: {
    Wrapper,
    MoleculePaymentCard,
  },
  props: {
    bookingDetails: {
      type: Object,
    },
    paymentMode: {
      type: Object,
    },
  },
};
</script>

<style></style>
