<template>
  <div class="t_payment_gateway section">
    <o-payment-gateway
      :bookingDetails="bookingDetails"
      :payGateDetails="payGateDetails"
      :payModeDetails="payModeDetails"
    />
  </div>
</template>

<script>
import OPaymentGateway from "../organisms/o-payment-gateway.vue";
export default {
  props: {
    bookingDetails: Object,
    payGateDetails: Object,
    payModeDetails: Object,
  },
  components: {
    OPaymentGateway,
  },
  name: "t-payment-gateway",
};
</script>

<style scoped>
.t_payment_gateway {
  background: url("../../assets/img/payment-wall.svg");
}
</style>