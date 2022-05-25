<template>
  <div class="m-features-details">
    <atom-img class="m-features-details__img" :src="src" />
    <atom-b-subtitle
      class="m-features-details__title"
      :text="featuresTitle"
    ></atom-b-subtitle>
    <br />
    <p class="m-features-details__text" v-html="featuresText"></p>
  </div>
</template>

<script>
import AtomImg from "../atoms/atom-img/atom-img.vue";
import atomBSubtitle from "../atoms/atom-text/atom-b-subtitle.vue";
export default {
  name: "MFeaturesDetails",
  components: { atomBSubtitle, AtomImg },
  props: {
    featuresTitle: String,
    featuresText: String,
  },
  data() {
    return {
      src: require("../../assets/img/features-tick.svg"),
    };
  },
};
</script>

<style scoped>
.m-features-details__title {
  font-size: 2rem;
}
.m-features-details__img {
  max-width: 2.5rem;
}
.m-features-details__title {
  font-weight: 600;
}
.m-features-details__text {
  font-size: 1rem;
}
</style>
