<template>
  <div class="o_footer_top columns">
    <m-footer-left class="column" />
    <div class="column" style="max-width: 9.283819628647215vh"></div>
    <m-footer-middle class="column" />
    <m-footer-right class="column" />
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