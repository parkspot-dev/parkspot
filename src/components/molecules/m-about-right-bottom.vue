<template>
  <div class="m_about-right-bottom columns is-vcentered">
    <atom-b-title
      class="is-size-4-mobile is-size-3 column is-half"
      :text="title"
    />
    <div class="column is-half">
      <a
        href="https://play.google.com/store/apps/details?id=com.parkspot.maya_nagri&utm_source=parkspot.in&utm_campaign=website"
        target="_blank"
      >
        <atom-img class="ps_img" :src="src" alt="parkspot_app" />
      </a>
    </div>
  </div>
</template>

<script>
import AtomImg from "@/components/atoms/atom-img/atom-img.vue";
import atomBTitle from "@/components/atoms/atom-text/atom-b-title.vue";
export default {
  name: "MAboutRightBottom",
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
@media only screen and (min-width: 1024px) {
  .ps_img {
    max-width: 165px;
  }
}
</style>
