 <template >
  <footer class="footer ps_footer_color">
    <div class="container">
      <o-footer-top />
      <br>
      <o-footer-bottom />
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
.footer{
  padding-bottom: 100px;
}
</style>
