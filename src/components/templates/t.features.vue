<template>
  <section class="t_features section">
    <div class="container">
        <atom-b-title
          class="is-size-3-mobile is-size-2 ps_mb has-text-centered"
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
          text: "ParkSpot allows user a navigation feature to give a proper direction of parking site.",
        },
        {
          id: 2,
          src: require("@/assets/img/features-booking.svg"),
          title: "Booking",
          text: "Book your spot and choose our newly added service like Pay Now and Pay Later.",
        },
      ],
      features2: [
        {
          id: 1,
          src: require("@/assets/img/features-searchParking.svg"),
          title: "Search parking",
          text: "Search our spots in your local area.",
        },
        {
          id: 2,
          src: require("@/assets/img/features-security.svg"),
          title: "Safety and Security",
          text: "Enhanced security systems in place and equipment like security camera and embedded sensors for monitoring vehicle.",
        },
      ],
    };
  },
};
</script>

<style scoped>
.ps_mb{
  margin-bottom: 50px;
}
@media only screen and (min-width: 1024px) {
.ps_mb{
  margin-bottom: 60px;
}}
</style>