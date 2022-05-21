<template>
  <div class="t_payment_gateway section">
    <div class="container">
      <o-payment-gateway
        v-if="!this.status"
        :booking-details="bookingDetails"
        :payment-mode="paymentMode"
      />
      <o-payment-status
        v-if="this.status"
        :error="error"
        :success="success"
        :pending="pending"
        :display-msg="displayMsg"
        :display-msg-content="displayMsgContent"
      />
    </div>
  </div>
</template>

<script>
import OPaymentGateway from "../organisms/o-payment-gateway.vue";
import OPaymentStatus from "../organisms/o-payment-status.vue";
export default {
  name: "TPaymentGateway",
  components: {
    OPaymentGateway,
    OPaymentStatus,
  },
  props: {
    bookingDetails: Object,
    paymentMode: Object,
    status: Boolean,
    error: Boolean,
    success: Boolean,
    pending: Boolean,
    displayMsg: Boolean,
    displayMsgContent: String,
  },
};
</script>

<style scoped>
.t_payment_gateway {
  background: url("../../assets/img/payment-wall.svg");
}
.card-template {
  top: 50%;
  transform: translateY(50%);
  /* transform: translateX(-50%); */
}
/* @media only screen and (min-width: 1024px) {
  .card-template {
    top: 50%;
    transform: translateY(50%);
    transform: translateX(50%);
  }
} */
</style>
