<template>
  <div class="t_payment_gateway section">
    <o-payment-gateway />
  </div>
</template>

<script>
import OPaymentGateway from "../organisms/o-payment-gateway.vue";
export default {
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