<template>
  <div class="m_footer_middle">
    <atom-text :text="text1" />
    <atom-img :src="src" />
    <atom-text :text="text2" />
    <atom-boxicon :types="boxicons.twitter.type" :name="boxicons.twitter.icon" />
    <atom-boxicon :types="boxicons.insta.type" :name="boxicons.insta.icon" />
    <atom-boxicon :types="boxicons.fb.type" :name="boxicons.fb.icon" />
    <atom-boxicon :types="boxicons.linkd.type" :name="boxicons.linkd.icon" />
  </div>
</template>

<script>
import atomText from "@/components/atoms/atom-text/atom-text.vue";
import AtomImg from '@/components/atoms/atom-img/atom-img.vue';
import AtomBoxicon from '../atoms/atom-boxicons/atom-boxicon.vue';
export default {
  components: { atomText,AtomImg,AtomBoxicon },
  name: "m-footer-middle",
  data() {
    return {
      text1: "Now Available on",
      text2: "Follow us",
      src: require('@/assets/img/google-play-badge.png'),
      boxicons:{
          twitter:{
              type:"logo",
              icon:"twitter"
          },
          insta:{
              type:"logo",
              icon:"instagram"
          },
          fb:{
              type:"logo",
              icon:"facebook"
          },
          linkd:{
              type:"logo",
              icon:"linkedin"
          },
      }
    };
  },
};
</script>