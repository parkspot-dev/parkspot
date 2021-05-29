<template>
  <div class="m_footer_middle">
    <atom-text :text="text1" />
    <atom-img :src="src" />
    <atom-text :text="text2" />
  </div>
</template>

<script>
import atomText from "@/components/atoms/atom-text/atom-text.vue";
import AtomImg from '@/components/atoms/atom-img/atom-img.vue';
export default {
  components: { atomText,AtomImg },
  name: "m-footer-middle",
  data() {
    return {
      text1: "Now Available on",
      text2: "Follow us",
      src: require('@/assets/img/google-play-badge.png')
    };
  },
};
</script>