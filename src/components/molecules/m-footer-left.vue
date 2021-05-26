<template>
  <div class="m_footer_left">
    <atom-img />
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
      
    }
  },
  components: {
    AtomImg,
    AtomBTitle,
    AtomBSubtitle,
  },
};
</script>