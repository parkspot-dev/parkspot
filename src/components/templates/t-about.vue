<template>
  <div class="t_about section">
    <div class="columns">
      <atom-img class="column is-half" :src="src" v-scroll-reveal.reset />
      <o-about-right class="column is-half"  v-scroll-reveal.reset/>
    </div>
  </div>
</template>

<script>
import AtomImg from "@/components/atoms/atom-img/atom-img.vue";
import OAboutRight from "@/components/organisms/o-about-right.vue";
export default {
  components: { AtomImg, OAboutRight },
  name: "t-about",
  data() {
    return {
      src: require("@/assets/img/about.svg"),
    };
  },
};
</script>

<style scoped>
</style>