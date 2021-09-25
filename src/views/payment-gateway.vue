<template>
  <div class="payment_gateway">
    <t-payment-gateway
      :bookingDetails="bookingDetails"
      :payGateDetails="payGateDetails"
      :payModeDetails="payModeDetails"
    />
  </div>
</template>
<script>
import tPaymentGateway from "../components/templates/t-payment-gateway.vue";
export default {
  components: { tPaymentGateway },
  name: "payment-gateway",
  data() {
    return {
      bookingDetails: {},
      payGateDetails: {},
      payModeDetails: {},
    };
  },
  mounted() {
    this.getBookingDetails();
  },
  methods: {
    async getBookingDetails() {
      const b = this.$route.query.b;
      const h = this.$route.query.h;
      const d = this.$route.query.d;
      const res = await fetch(
        `https://maya.parkspot.in/payment/validate?b=${b}&h=${h}&d=${d}`
      );
      const data = await res.json();
      this.payGateDetails = { ...data.Payment.GatewayTokenMap };
      this.payModeDetails = { ...data.Payment.ModeGatewayMap };
      this.bookingDetails = { ...data.BookingInfo };
      console.log(this.payGateDetails);
      console.log(this.payModeDetails);
      console.log(this.bookingDetails);
      console.log(data);
    },
  },
};
</script>