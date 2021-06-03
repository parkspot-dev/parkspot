<template>
  <section class="t_features section">
    <div class="container">
        <atom-b-title
          class="is-size-3-mobile is-size-2 mb-2 has-text-centered"
          :text="title"
        />
      <div class="columns">
        <div class="column is-half has-text-centered"  :key="feature.id" v-for="feature in features1">
          <div class="box">
            <o-features-details
              :subtitle="feature.title"
              :text="feature.text"
              :src="feature.src"
            />
          </div>
        </div>
      </div>
      <div class="columns">
        <div class="column is-half has-text-centered"  :key="feature.id" v-for="feature in features2">
          <div class="box">
            <o-features-details
              :subtitle="feature.title"
              :text="feature.text"
              :src="feature.src"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import atomBTitle from "@/components/atoms/atom-text/atom-b-title.vue";
import AtomImg from "@/components/atoms/atom-img/atom-img.vue";
import OFeaturesDetails from "@/components/organisms/o-features-details.vue";
import AtomBTitle from "../atoms/atom-text/atom-b-title.vue";
export default {
  components: { atomBTitle, AtomImg, OFeaturesDetails, AtomBTitle },
  name: "t-features",
  data() {
    return {
      title: "ParkSpot Features",
      features1: [
        {
          id: 1,
          src: require("@/assets/img/features-navigation.svg"),
          title: "Navigation",
          text: "We provide Navigation",
        },
        {
          id: 2,
          src: require("@/assets/img/features-navigation.svg"),
          title: "Navigation",
          text: "We provide Navigation",
        },
      ],
      features2: [
        {
          id: 1,
          src: require("@/assets/img/features-navigation.svg"),
          title: "Navigation",
          text: "We provide Navigation",
        },
        {
          id: 2,
          src: require("@/assets/img/features-navigation.svg"),
          title: "Navigation",
          text: "We provide Navigation",
        },
      ],
    };
  },
};
</script>