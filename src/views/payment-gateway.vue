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
    const statusURL = /status|order_id/;
    const paymentURL = /payment|validate|p|h/;
    if (statusURL.test(this.$route.params.pathMatch)) {
      this.status = !this.status;
      this.getStatus();
    } else if (paymentURL.test(this.$route.params.pathMatch)) {
      this.getBookingDetails();
    }
    // console.log("check");
    // console.log(this.$route);
  },
  methods: {
    async getBookingDetails() {
      const p = this.$route.query.p;
      const h = this.$route.query.h;
      try {
        const response = await fetch(
          `https://maya.parkspot.in/payment/validate?p=${p}&h=${h}`,
          {
            headers: {
              "Content-Type": "application/json",
              // 'Content-Type': 'application/x-www-form-urlencoded',
              flavour: this.flavour,
            },
          }
        );
        if (!response.ok) {
          throw new Error(response);
        } else {
          const data = await response.json();
          this.bookingDetails = {
            name: data.BookingInfo.Name,
            dueDate: data.DueDate,
            amount: data.PaymentInfo.Amount,
            discount: data.PaymentInfo.Discount,
            convenienceFee: data.PaymentInfo.ConvenienceFee,
          };
          this.paymentMode = { ...data.Payment };
        }
      } catch (exception) {
        console.log(exception);
        this.status = !this.status;
        this.getStatus();
      }
    },
    async getStatus() {
      console.log(this.$route.query);
      const o = this.$route.query.order_id;
      const response = await fetch(
        `https://maya.parkspot.in/payment/status?order_id=${o}`,
        {
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
            flavour: this.flavour,
          },
        }
      );
      const data = await response.json();
      // console.log("data");
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