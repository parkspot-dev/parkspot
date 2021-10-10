<template>
  <div class="payment_gateway">
    <t-payment-gateway
      :bookingDetails="bookingDetails"
      :paymentMode="paymentMode"
      :status="status"
      :error="error"
      :success="success"
      :pending="pending"
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
      paymentMode: {},
      status: false,
      error: false,
      success: false,
      pending: false,
    };
  },
  computed: {
    flavour() {
      return this.$store.getters["device/getFlavour"];
    },
  },
  mounted() {
    let urlCheck = /status/;
    if (urlCheck.test(this.$route.params.pathMatch)) {
      this.status = !this.status;

      console.log("hello");
      this.getStatus();
    } else {
      this.getBookingDetails();
    }
    // console.log("check");
    // console.log(this.$route);
  },
  methods: {
    async getBookingDetails() {
      const b = this.$route.query.b;
      const h = this.$route.query.h;
      const d = this.$route.query.d;
      const res = await fetch(
        `https://maya.parkspot.in/payment/validate?b=${b}&h=${h}&d=${d}`,
        {
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
            flavour: this.flavour,
          },
        }
      );
      const data = await res.json();
      // console.log(data);
      this.bookingDetails = {
        name: data.BookingInfo.Name,
        dueDate: data.DueDate,
        amount: data.Fee.Amount,
        discount: data.Fee.Discount,
        convenienceFee: data.Fee.ConvenienceFee,
      };
      this.paymentMode = { ...data.Payment };
      // console.log(this.bookingDetails);
    },
    async getStatus() {
      console.log(this.$route.query);
      const o = this.$route.query.order_id;
      const res = await fetch(
        `https://maya.parkspot.in/payment/status?order_id=${o}`,
        {
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
            flavour: this.flavour,
          },
        }
      );
      const data = await res.json();
      console.log("data");
      console.log(data);
      if (data === "PAID") {
        this.success = !this.success;
      } else if (data === "ACTIVE") {
        this.pending = !this.pending;
      } else {
        this.error = !this.error;
      }
    },
  },
};
</script>