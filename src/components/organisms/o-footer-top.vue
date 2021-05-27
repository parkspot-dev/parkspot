<template>
  <div class="o_footer_top">
    <m-footer-left />
    <m-footer-middle />
    <m-footer-right />
  </div>
</template>
<script>
import MFooterLeft from "@/components/molecules/m-footer-left.vue";
import MFooterMiddle from "@/components/molecules/m-footer-middle.vue";
import MFooterRight from "@/components/molecules/m-footer-right.vue";
export default {
  name: "o-footer-top",
  components: {
    MFooterLeft,
    MFooterMiddle,
    MFooterRight,
  },
};
</script>