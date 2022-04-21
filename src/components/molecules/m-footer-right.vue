<template>
  <div class="m_footer_right">
    <!-- <atom-boxicon :name="boxicons.call.icon"/> -->
    <atom-b-subtitle class="is-size-6 mb-2" :text="title" />
    <atom-text class="is-size-7" :text="text1" />
    <a
      class="is-size-7"
      style="color: white"
      href="mailto: connect@parkspot.in"
    >
      connect@parkspot.in</a
    >
    <!-- <atom-text class="is-size-7" :text="text2" /> -->
    <atom-text class="is-size-7" :text="text3" />
  </div>
</template>

<script>
import AtomText from "@/components/atoms/atom-text/atom-text.vue";
import AtomBSubtitle from "../atoms/atom-text/atom-b-subtitle.vue";
export default {
  name: "m-footer-right",
  data() {
    return {
      title: "Contact Us",
      text1: "+91 80929 96057",
      text2: "connect@parkspot.in",
      text3:
        "2nd Floor, Nextcoworks BTM Layout, BTM 2nd Stage, Bengaluru, Karnataka 560076",
      boxicons: {
        call: {
          type: "logo",
          icon: "phone-call",
        },
      },
    };
  },
  components: {
    AtomText,
    AtomBSubtitle,
  },
};
</script>
<style scoped></style>
