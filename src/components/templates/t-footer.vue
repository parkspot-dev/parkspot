 <template >
<footer>
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
