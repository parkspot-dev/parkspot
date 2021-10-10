<template>
  <div class="o_payment_status">
    <div class="card">
      <div class="card-content">
        <div class="media" v-if="success">
          <div class="media-content" style="text-align: center">
            <atom-img :src="successImg" :alt="successImgAlt" />
            <atom-text class="is-size-4" :text="successMsg" />
            <atom-text class="is-size-6" :text="successInfo" />
          </div>
        </div>
        <div class="media" v-if="error">
          <div class="media-content" style="text-align: center">
            <atom-img :src="failImg" :alt="failImgAlt" />
            <atom-text class="is-size-4" :text="failMsg" />
            <atom-text class="is-size-6" :text="failInfo" />
          </div>
        </div>
        <div class="media" v-if="pending">
          <div class="media-content" style="text-align: center">
            <atom-img :src="pendingImg" :alt="pendingImgAlt" />
            <atom-text class="is-size-4" :text="pendingMsg" />
            <atom-text class="is-size-6" :text="pendingInfo" />
          </div>
        </div>
        <!-- <div class="media-right">
            <atom-img class="image" :src="img" />
          </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import AtomImg from "../atoms/atom-img/atom-img.vue";
import atomText from "../atoms/atom-text/atom-text.vue";
export default {
  components: { atomText, AtomImg },
  name: "o-payment-status",
  props: {
    error: Boolean,
    success: Boolean,
    pending: Boolean,
  },
  data() {
    return {
      successMsg: "Thank You!",
      successInfo: "Your payment successful for the amount 2500",
      successImg: require("../../assets/img/success.png"),
      successImgAlt: "success.png",
      failMsg: "Oops! Something went wrong.",
      failInfo:
        "Please try again after some time or you can contact us for any issues.",
      failImg: require("../../assets/img/error.png"),
      failImgAlt: "error.png",
      pendingMsg: "Payment pending at ParkSpot",
      pendingInfo:
        "Please refresh the page to check the status again or if the balance got deducted from the account and not reflecting the status then contact us",
      pendingImg: require("../../assets/img/pending.png"),
      pendingImgAlt: "pending.png",
    };
  },
};
</script>

<style scoped>
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
}
</style>