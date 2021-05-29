 <template >
<footer class="footer ps_footer_color">
  <o-footer-top/>
  <o-footer-bottom/>
</footer>
</template>
<script>
import OFooterTop from '@/components/organisms/o-footer-top.vue';
import OFooterBottom from '@/components/organisms/o-footer-bottom.vue';
export default {
  name: "t-footer",
  components:{
    OFooterTop,
    OFooterBottom,
  }
}
</script>

<style scoped>
.ps_footer_color{
  background-color:#242329;
  color:white;
}
</style>
