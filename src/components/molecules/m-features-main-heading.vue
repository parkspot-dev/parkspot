<template>
  <div class="main-heading columns">
    <div class="main-heading__text column is-one-third">
      <m-features-title> </m-features-title>
      <br />
      <atom-text
        class="main-heading__para"
        :text="'Finding cheap and best parking space with ease. \
        Providing a lot of features that no other parking platforms provide.\
        '"
      >
      </atom-text>
      <atom-text
        class="main-heading__para"
        :text="'Navigation, Booking, Searching, Safety & Security and many\
         others services at ParkSpot which makes your parking experience better than ever'"
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
      <div class="img-wrapper">
        <div class="img-wrapper__img-width">
          <atom-img :src="src"></atom-img>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AtomImg from "../atoms/atom-img/atom-img.vue";
import AtomRouterLink from "../atoms/atom-link/atom-router-link.vue";
import AtomText from "../atoms/atom-text/atom-text.vue";
import MFeaturesTitle from "./m-features-title.vue";
export default {
  name: "MFeaturesMainHeading",
  components: { AtomText, MFeaturesTitle, AtomImg, AtomRouterLink },
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

.btn-shadow {
  box-shadow: 0 4px 30px -10px;
}
.img-wrapper {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}
.img-wrapper__img-width {
  width: 384px;
}

@media only screen and (min-width: 1024px) {
  .img-wrapper__img-width {
    width: 680px;
  }
  .main-heading__para {
    font-size: 1.25rem;
    line-height: 28px;
  }
}
</style>
