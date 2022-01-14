<template>
  <div class="o_payment_gateway">
    <m-loading-page v-if="loading" />
    <div class="card" v-if="!loading">
      <div class="card-content">
        <div class="media">
          <div class="media-content">
            <atom-text
              class="is-size-6-mobile is-size-5 has-text-weight-medium"
              :textLeft="nameText"
              :text="bookingDetails.name"
            />
            <atom-text
              class="is-size-6-mobile is-size-5 has-text-weight-medium"
              :textLeft="dateText"
              :text="bookingDetails.dueDate"
            />
            <div class="ps_inline">
              <atom-text
                class="is-size-6-mobile is-size-5 has-text-weight-medium"
                :textLeft="amtText"
              />
              <atom-text
                class="
                  is-size-4-mobile is-size-3
                  ml-3
                  has-text-weight-bold has-text-success
                "
                :text="bookingDetails.amount"
                :textRight="sign"
              />
            </div>
          </div>
        </div>
        <!-- <atom-text
          class="is-size-6-mobile is-size-5 has-text-weight-medium"
          :textLeft="paymentText"
          :text="name"
        /> -->
        <div class="media" style="border-top: 0">
          <div class="media-content" style="text-align: center">
            <a :href="paymentMode.PaymentLink">
              <atom-button
                class="button is-rounded"
                style="background-color: #ffe08a; width: 80%"
                :text="payNow"
                v-on:click.native="isLoading"
              />
            </a>
          </div>
        </div>
        <!-- <div class="media">
          <div
            :key="box"
            class="media-content tooltip"
            style="text-align: center"
            v-for="box in boxicon"
          >
            <i class="qtip tip-bottom" :data-tip="box.tipText">
              <atom-boxicon
                style="cursor: pointer"
                v-on:click.native="cardPayment"
                :types="box.type"
                :color="box.color"
                :size="box.size"
                :name="box.name"
            /></i>
          </div>
        </div> -->
        <p class="is-size-7 has-text-centered">
          Bill description: Rent : {{ bookingDetails.baseAmount }} , Discount :
          {{ bookingDetails.discount }}, Convenience Fee :
          {{ bookingDetails.convenienceFee }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import AtomBoxicon from "../atoms/atom-boxicons/atom-boxicon.vue";
import AtomButton from "../atoms/atom-button/atom-button.vue";
import AtomImg from "../atoms/atom-img/atom-img.vue";
import AtomText from "../atoms/atom-text/atom-text.vue";
import MLoadingPage from "../molecules/m-loading-page.vue";
export default {
  components: { AtomText, AtomImg, AtomBoxicon, AtomButton, MLoadingPage },
  name: "o-payment-gateway",
  props: {
    bookingDetails: Object,
    paymentMode: Object,
  },
  data() {
    return {
      nameText: "Name:  ",
      dateText: "Due Date:  ",
      amtText: "Amount:  ",
      sign: "/-",
      paymentText: "Payment Mode: ",
      img: require("@/assets/logo.png"),
      payNow: "Pay Now",
      loading: false,
      // ** Not needed as of now as we are using single Payment Link
      // boxicon: {
      //   card: {
      //     name: "credit-card",
      //     type: "solid",
      //     color: "black",
      //     size: "md",
      //     tipText: "Credit-Card",
      //     //   rotate: "rotate",
      //     //   flip: "flip",
      //     //   border: "border",
      //     //   animation: "animation",
      //     //   pull: "pull",
      //   },
      //   upi: {
      //     type: "solid",
      //     color: "black",
      //     size: "md",
      //     name: "credit-card",
      //     tipText: "UPI",
      //   },
      //   wallet: {
      //     type: "solid",
      //     color: "black",
      //     size: "md",
      //     name: "wallet",
      //     tipText: "Wallet",
      //   },
      //   netBanking: {
      //     type: "solid",
      //     color: "black",
      //     size: "md",
      //     name: "bank",
      //     tipText: "Net-Banking",
      //   },
      // },
    };
  },
  mounted() {
    console.log("debug");
    console.log(this.paymentMode.PaymentLink);
  },
  methods: {
    isLoading() {
      this.loading = !this.loading;
    },
  },
};
</script>

<style scoped>
.ps_inline {
  display: inline-flex;
  flex-wrap: nowrap;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.card {
  letter-spacing: 0.5px;
  border-radius: 30px;
}
@media only screen and (min-width: 1024px) {
  .card {
    left: 50%;
    transform: translateX(-50%);
    height: auto;
    width: 40vw;
    letter-spacing: 2px;
  }
  /* this is temp */
  .qtip {
    display: inline-block;
    position: relative;
    cursor: pointer;
    color: #3bb4e5;
    border-bottom: 0.05em dotted #3bb4e5;
    box-sizing: border-box;
    font-style: normal;
    transition: all 0.25s ease-in-out;
  }
  .qtip:hover {
    color: #069;
    border-bottom: 0.05em dotted #069;
  }
  .qtip:before {
    content: attr(data-tip);
    font-size: 14px;
    position: absolute;
    background: rgba(10, 20, 30, 0.85);
    color: #fff;
    line-height: 1.2em;
    padding: 0.5em;
    font-style: normal;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    min-width: 120px;
    text-align: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease-in-out;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
    font-family: sans-serif;
    letter-spacing: 0;
    font-weight: 600;
  }
  .qtip:after {
    width: 0;
    height: 0;
    border-style: solid;
    content: "";
    position: absolute;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease-in-out;
  }
  .qtip:hover:before,
  .qtip:hover:after {
    visibility: visible;
    opacity: 1;
  }
  .qtip.tip-bottom:before {
    bottom: 0;
    left: 50%;
    transform: translate(-50%, calc(100% + 8px));
    box-sizing: border-box;
    border-radius: 3px;
  }
  .qtip.tip-bottom:after {
    border-width: 0 8px 8px 8px;
    border-color: transparent transparent rgba(10, 20, 30, 0.85) transparent;
    bottom: -8px;
    left: 50%;
    transform: translate(-50%, 0);
  }
}
</style>