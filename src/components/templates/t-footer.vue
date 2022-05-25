<template>
  <footer class="footer ps_footer_color">
    <div class="container">
      <m-footer-top-places class="ps_padding" />
      <o-footer-top style="padding-top: 30px" />
      <br />
      <o-footer-bottom class="ps_line" />
    </div>
  </footer>
</template>
<script>
import OFooterTop from "@/components/organisms/o-footer-top.vue";
import OFooterBottom from "@/components/organisms/o-footer-bottom.vue";
import MFooterTopPlaces from "../molecules/m-footer-top-places.vue";
export default {
  name: "TFooter",
  components: {
    OFooterTop,
    OFooterBottom,
    MFooterTopPlaces,
  },
};
</script>

<style scoped>
.ps_footer_color {
  background-color: #393939;
  color: white;
}
.footer {
  padding-bottom: 100px;
}
.ps_padding {
  border-bottom: 1px solid #8e8e8e;
  padding-bottom: 30px;
}
.ps_line {
  border-top: 1px solid #8e8e8e;
  padding-top: 30px;
}
@media only screen and (min-width: 1024px) {
  .footer {
    padding-bottom: 50px;
  }
}
</style>
