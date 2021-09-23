 <template >
  <footer class="footer ps_footer_color">
    <div class="container">
      <o-footer-top />
      <br />
      <o-footer-bottom class="ps_line" />
    </div>
  </footer>
</template>
<script>
import OFooterTop from "@/components/organisms/o-footer-top.vue";
import OFooterBottom from "@/components/organisms/o-footer-bottom.vue";
export default {
  name: "t-footer",
  components: {
    OFooterTop,
    OFooterBottom,
  },
};
</script>

<style scoped>
.ps_footer_color {
  background-color: #242329;
  color: white;
}
.footer {
  padding-bottom: 100px;
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
