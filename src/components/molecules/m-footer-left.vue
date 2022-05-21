<template>
  <div class="m_footer_left columns">
    <div class="column">
      <div class="columns is-mobile">
        <div v-lazyload class="column is-one-fifth">
          <atom-img class="ps_img" :data-url="src" />
        </div>
        <div class="column is-1"></div>
        <div class="column">
          <atom-b-title class="is-size-2" :text="brand" />
          <atom-b-subtitle class="has-text-centered" :text="hookup" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AtomImg from "@/components/atoms/atom-img/atom-img.vue";
import AtomBSubtitle from "@/components/atoms/atom-text/atom-b-subtitle.vue";
import AtomBTitle from "@/components/atoms/atom-text/atom-b-title.vue";
export default {
  name: "MFooterLeft",
  components: {
    AtomImg,
    AtomBTitle,
    AtomBSubtitle,
  },
  data() {
    return {
      src: require("@/assets/img/pstopmini.png"),
      brand: "ParkSpot",
      hookup: "Get the Spot",
    };
  },
};
</script>

<style scoped>
.ps_img {
  max-width: 80px;
  max-height: 80px;
}
</style>
