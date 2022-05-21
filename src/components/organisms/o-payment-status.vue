<template>
  <div class="o_payment_status">
    <div class="card">
      <div class="card-content">
        <div v-if="success" class="media">
          <div class="media-content" style="text-align: center">
            <atom-img :src="successImg" :alt="successImgAlt" />
            <atom-text class="is-size-4" :text="successMsg" />
            <atom-text class="is-size-6" :text="successInfo" />
          </div>
        </div>
        <div v-if="error" class="media">
          <div class="media-content" style="text-align: center">
            <atom-img :src="failImg" :alt="failImgAlt" />
            <atom-text class="is-size-4" :text="failMsg" />
            <atom-text class="is-size-6" :text="failInfo" />
          </div>
        </div>
        <div v-if="displayMsg" class="media">
          <div class="media-content" style="text-align: center">
            <atom-img :src="failImg" :alt="failImgAlt" />
            <atom-text class="is-size-4" :text="displayMsgContent" />
            <!-- <atom-text class="is-size-6" :text="failInfo" /> -->
          </div>
        </div>
        <div v-if="pending" class="media">
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
  name: "OPaymentStatus",
  components: { atomText, AtomImg },
  props: {
    error: Boolean,
    success: Boolean,
    pending: Boolean,
    displayMsg: Boolean,
    displayMsgContent: String,
  },
  data() {
    return {
      successMsg: "Thank You!",
      successInfo: "Your payment was successful.",
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
