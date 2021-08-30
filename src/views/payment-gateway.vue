<template>
  <div class="payment_gateway">
    <t-payment-gateway />
  </div>
</template>
<script>
import tPaymentGateway from "../components/templates/t-payment-gateway.vue";
export default {
  components: { tPaymentGateway },
  name: "payment-gateway",
};
</script>