<template>
  <div class="main-heading columns">
    <div class="main-heading__text column">
      <m-features-title> </m-features-title>
      <br />
      <atom-text
        class="main-heading__para"
        :text="'Finding cheap and best parking space with ease. Providing a lot of features that no other platforms provide.'"
      >
      </atom-text>
      <br />

      <!-- <atom-button :text="featuresButton"> -->
      <atom-router-link
        class="button btn-shadow is-rounded is-warning"
        :text="featuresButton"
        :link="featuresButtonLink"
      />
      <!-- </atom-button> -->
    </div>
    <div class="main-heading__img column">
      <atom-img :src="src"></atom-img>
    </div>
  </div>
</template>
<script>
import atomButton from "../atoms/atom-button/atom-button.vue";
import AtomImg from "../atoms/atom-img/atom-img.vue";
import AtomRouterLink from "../atoms/atom-link/atom-router-link.vue";
import AtomText from "../atoms/atom-text/atom-text.vue";
import MFeaturesTitle from "./m-features-title.vue";
export default {
  components: { atomButton, AtomText, MFeaturesTitle, AtomImg, AtomRouterLink },
  name: "m-features-main-heading",
  props: {
    featuresButton: {
      type: String,
      default() {
        return "Contact Us";
      },
    },
    featuresButtonLink: {
      type: String,
      default() {
        return "t-contact";
      },
    },
  },
  data() {
    return {
      src: require("../../assets/img/features.png"),
    };
  },
};
</script>
<style scoped>
.main-heading {
  background: url("../../assets/img/main-header-blob.svg");
  background-repeat: no-repeat;
}
.main-heading__para {
  line-height: 36px;
}
.btn-shadow {
  box-shadow: 0 4px 30px -10px;
}
</style>