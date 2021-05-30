<template>
  <div class="m_about-right-bottom columns is-vcentered ">
    <atom-b-title class="ps_title column is-half" :text="title" />
    <atom-img class="ps_img column is-half" :src="src" />
  </div>
</template>

<script>
import AtomImg from "@/components/atoms/atom-img/atom-img.vue";
import atomBTitle from "@/components/atoms/atom-text/atom-b-title.vue";
export default {
  name: "m-about-right-bottom",
  components: {
    AtomImg,
    atomBTitle,
  },
  data() {
    return {
      title: "Get ParkSpot App",
      src: require("@/assets/img/google-play-badge.png"),
    };
  },
};
</script>

<style scoped>
.ps_title{
  font-size: 28px;
}

@media only screen and (min-width: 1024px) {
.ps_img{
    max-width: 165px;
}
}


</style>