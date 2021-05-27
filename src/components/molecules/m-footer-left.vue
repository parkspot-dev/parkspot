<template>
  <div class="m_footer_left">
    <atom-img :src="src"/>
    <atom-b-title />
    <atom-b-subtitle/>
  </div>
</template>
<script>
import AtomImg from "@/components/atoms/atom-img/atom-img.vue";
import AtomBSubtitle from '@/components/atoms/atom-text/atom-b-subtitle.vue';
import AtomBTitle from "@/components/atoms/atom-text/atom-b-title.vue";
export default {
  name: "m-footer-left",
  data(){
    return{
      src:require("@/assets/img/pstopmini.png")
    }
  },
  components: {
    AtomImg,
    AtomBTitle,
    AtomBSubtitle,
  },
};
</script>