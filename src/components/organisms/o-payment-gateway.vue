<template>
  <div class="o_payment_gateway">
    <div class="card">
      <div class="card-content">
        <div class="media">
          <div class="media-content">
            <atom-text
              class="is-size-6-mobile is-size-5 has-text-weight-medium"
              :textLeft="nameText"
              :text="bookingDetails.Name"
            />
            <atom-text
              class="is-size-6-mobile is-size-5 has-text-weight-medium"
              :textLeft="dateText"
              :text="dummy.date"
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
                :text="dummy.amt"
                :textRight="sign"
              />
            </div>
          </div>
          <!-- <div class="media-right">
            <atom-img class="image" :src="img" />
          </div> -->
        </div>
        <atom-text
          class="is-size-6-mobile is-size-5 has-text-weight-medium"
          :textLeft="paymentText"
          :text="name"
        />
        <div class="media">
          <div class="media-content tooltip">
            <atom-boxicon
              style="cursor: pointer"
              v-on:click.native="cardPayment"
              :types="boxicon.type"
              :color="boxicon.color"
              :size="boxicon.size"
              :name="boxicon.card.name"
            />
            <span class="tooltiptext">{{ boxicon.card.name }}</span>
          </div>

          <div class="media-content tooltip">
            <atom-boxicon
              style="cursor: pointer"
              :types="boxicon.type"
              :color="boxicon.color"
              :size="boxicon.size"
              :name="boxicon.card.name"
            />
            <span class="tooltiptext">{{ boxicon.card.name }}</span>
          </div>
          <div class="media-content tooltip">
            <atom-boxicon
              style="cursor: pointer"
              :types="boxicon.type"
              :color="boxicon.color"
              :size="boxicon.size"
              :name="boxicon.netBanking.name"
            />
            <span class="tooltiptext">{{ boxicon.netBanking.name }}</span>
          </div>
          <div class="media-content tooltip">
            <a :href="dummy.paymentLink" target="_blank">
              <atom-boxicon
                style="cursor: pointer"
                :types="boxicon.type"
                :color="boxicon.color"
                :size="boxicon.size"
                :name="boxicon.wallet.name"
              />
            </a>
            <span class="tooltiptext">{{ boxicon.wallet.name }}</span>
          </div>
        </div>
        <atom-text class="is-size-7" :textLeft="BillText" :text="bill" />
      </div>
    </div>
  </div>
</template>

<script>
import AtomBoxicon from "../atoms/atom-boxicons/atom-boxicon.vue";
import AtomImg from "../atoms/atom-img/atom-img.vue";
import AtomText from "../atoms/atom-text/atom-text.vue";
export default {
  components: { AtomText, AtomImg, AtomBoxicon },
  name: "o-payment-gateway",
  props: {
    bookingDetails: Object,
    payGateDetails: Object,
    payModeDetails: Object,
  },
  data() {
    return {
      dummy: {
        name: "Sujeet Manjhi",
        date: "30th Aug 2021",
        amt: "2500",
        paymentLink:
          "https://payments-test.cashfree.com/order/#YL0gWcw1fSBh9oIKv2xn",
      },
      nameText: "Name:  ",
      dateText: "Due Date:  ",
      amtText: "Amount:  ",
      sign: "/-",
      paymentText: "Payment Mode: ",
      BillText: "Bill description: ",
      bill: "Total : 2300 , discount : -300, GST : 500 , Total Amount: 2500 ",
      img: require("@/assets/logo.png"),
      boxicon: {
        type: "solid",
        color: "black",
        size: "md",
        card: {
          name: "credit-card",

          //   rotate: "rotate",
          //   flip: "flip",
          //   border: "border",
          //   animation: "animation",
          //   pull: "pull",
        },
        upi: {
          name: "credit-card",
        },
        wallet: {
          name: "wallet",
        },
        netBanking: {
          name: "bank",
        },
      },
    };
  },
  methods: {
    async cardPayment() {
      let opts = {
        payment_method: {
          card: {
            channel: "link",
            card_cvv: "900",
            card_expiry_yy: "22",
            card_expiry_mm: "06",
            card_holder_name: "Tushar Gupta",
            card_number: "4111111111111111",
          },
        },
        order_token: "mFmqz7bKdVE00okOodBY",
      };

      console.log("card payment");
      const res = await fetch("https://sandbox.cashfree.com/pg/orders/pay", {
        method: "POST",
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(opts),
      });
      const data = await res.json();
      console.log("response cashfree");
      console.log(data);
      const a = 10;
      const b = 10;
      console.log(a + b);
    },
  },
};
</script>

<style scoped>
.image {
  height: 55px;
  /* max-height: 8vh; */
}
.ps_inline {
  display: inline-flex;
  flex-wrap: nowrap;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.card {
  letter-spacing: 0.5px;
}

@media only screen and (min-width: 1024px) {
  .image {
    height: 65px;
    /* max-height: 8vh; */
  }
  .card {
    top: 50%;
    left: 28%;
    height: auto;
    width: 40vw;
    letter-spacing: 2px;
  }
  /* hover text  */
  .tooltip {
    position: relative;
    display: inline-block;
  }

  .tooltip .tooltiptext {
    visibility: hidden;
    width: 100px;
    background-color: #ffdd57;
    color: black;
    text-align: center;
    border-radius: 6px;
    padding: 0.25px 0;
    font-size: 12px;
    letter-spacing: 0px;

    /* Position the tooltip */
    position: absolute;
    z-index: 1;
  }
  .tooltip:hover .tooltiptext {
    visibility: visible;
  }
}
</style>