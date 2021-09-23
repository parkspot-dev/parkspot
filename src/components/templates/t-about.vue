<template>
  <div ref="about" class="t_about mt-4 section">
    <div class="container">
      <div class="columns">
        <div class="column is-1"></div>
        <div class="column is-4">
          <atom-img :src="src" />
        </div>
        <o-about-right class="column" />
        <div class="column is-1"></div>
      </div>
    </div>
  </div>
</template>

<script>
import AtomImg from "@/components/atoms/atom-img/atom-img.vue";
import OAboutRight from "@/components/organisms/o-about-right.vue";
export default {
  title: "ParkSpot - About",
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
.t_about {
  background-color: #ececec;
}
</style>