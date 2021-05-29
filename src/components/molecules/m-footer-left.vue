<template>
  <div class="m_footer_left columns">
    <div class="column">
      <div class="columns is-mobile">
        <div class="column ps_img" v-lazyload>
          <atom-img :data-url="src" />
        </div>
        <atom-b-title
          class="ps_title column"
          :text="text1"
        />
      </div>
    </div>

    <atom-b-subtitle
      class="ps_subtitle column"
      :text="text2"
    />
  </div>
</template>
<script>
import AtomImg from "@/components/atoms/atom-img/atom-img.vue";
import AtomBSubtitle from "@/components/atoms/atom-text/atom-b-subtitle.vue";
import AtomBTitle from "@/components/atoms/atom-text/atom-b-title.vue";
export default {
  name: "m-footer-left",
  data() {
    return {
      src: require("@/assets/img/pstopmini.png"),
      text1: "ParkSpot",
      text2: "Get the Spot",
    };
  },
  components: {
    AtomImg,
    AtomBTitle,
    AtomBSubtitle,
  },
};
</script>

<style scoped>
.ps_title {
  font-size: 36px;
}
.ps_subtitle {
  font-size: 18px;
}
.ps_img {
  max-width: 11vh;
  max-height: 11vh;
}
</style>