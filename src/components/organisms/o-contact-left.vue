<template>
  <div class="o_contact_left">
    <atom-img class="ps_img mb-2 mx-5" :src="src" />
    <atom-text class="ps_subtitle" :text="para" />
  </div>
</template>

<script>
import atomImg from "@/components/atoms/atom-img/atom-img.vue";
import AtomText from "../atoms/atom-text/atom-text.vue";
export default {
  components: { atomImg, AtomText },
  name: "o-contact-left",
  data() {
    return {
      para: `If you have any questions or just want to get in touch with us, use the form beside.\n\nWe are looking forward to hear from you!`,
      src: require("@/assets/img/email.svg"),
    };
  },
};
</script>

<style scoped>
.ps_subtitle {
  font-size: 18px;
}
.ps_img {
  display: block;
  max-width: 50%;
}
</style>