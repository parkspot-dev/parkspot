<template>
  <div>
    <div v-if="sucess">
      <AtomImage :src="successImg"></AtomImage>
    </div>
    <div v-if="error">
      <AtomImage :src="failImg"></AtomImage>
    </div>
    <div v-if="pending">
      <AtomImage :src="pendingImg"></AtomImage>
    </div>
    <div v-if="displayMsg">
      <AtomImage :src="failImg"></AtomImage>
    </div>
  </div>
</template>

<script>
import AtomImage from "../atoms/AtomImage.vue";
export default {
  name: "MoleculePaymentStatusCard",
  components: {
    AtomImage,
  },
  props: {
    error: Boolean,
    success: Boolean,
    pending: Boolean,
    displayMsg: Boolean,
    displayMsgContent: String,
  },
  data() {
    return {
      successImg: require("../../assets/success.png"),
      failImg: require("../../assets/error.png"),
      pendingImg: require("../../assets/pending.png"),
    };
  },
};
</script>

<style></style>
