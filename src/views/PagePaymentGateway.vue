<template>
  <TemplatePaymentGateway
    :bookingDetails="bookingDetails"
    :paymentMode="paymentMode"
    :status="status"
    :error="error"
    :success="success"
    :pending="pending"
    :displayMsg="displayMsg"
    :displayMsgContent="displayMsgContent"
  >
  </TemplatePaymentGateway>
</template>
<script>
import TemplatePaymentGateway from "../components/templates/TemplatePaymentGateway.vue";
export default {
  name: "PagePaymentGateway",
  components: {
    TemplatePaymentGateway,
  },
  data() {
    return {
      bookingDetails: {},
      paymentMode: {},
      status: false,
      error: false,
      success: false,
      pending: false,
      displayMsg: false,
      displayMsgContent: "",
    };
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
              flavour: "this.flavour",
            },
          }
        );
        if (!response.ok) {
          throw new Error(response);
        } else {
          const data = await response.json();
          if (Object.prototype.hasOwnProperty.call(data, "ErrorCode")) {
            this.status = !this.status;
            this.displayMsg = !this.displayMsg;
            this.displayMsgContent = data.DisplayMsg;
          } else {
            this.bookingDetails = {
              name: data.BookingInfo.Name,
              dueDate: data.DueDate,
              amount: data.PaymentInfo.Amount,
              discount: data.PaymentInfo.Discount,
              convenienceFee: data.PaymentInfo.ConvenienceFee,
              baseAmount: data.PaymentInfo.BaseAmount,
            };
            this.paymentMode = { ...data.Payment };
          }
        }
      } catch (exception) {
        this.status = !this.status;
        this.getStatus();
      }
    },
    async getStatus() {
      const o = this.$route.query.order_id;
      const response = await fetch(
        `https://maya.parkspot.in/payment/status?order_id=${o}`,
        {
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
            flavour: "this.flavour",
          },
        }
      );
      const data = await response.json();
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
