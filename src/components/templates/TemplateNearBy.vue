<template>
  <div>
    <HeaderBanner>
      <AtomHeadings class="custom-title"> Book Your Parking Spot </AtomHeadings>
      <b-breadcrumb align="is-centered" size="is-small">
        <b-breadcrumb-item tag="router-link" to="/"> Home </b-breadcrumb-item>
        <b-breadcrumb-item tag="router-link" to="/blog" active>
          {{ locationWithCaps }}
        </b-breadcrumb-item>
      </b-breadcrumb>
      <div>
        <SearchInput></SearchInput>
      </div>
    </HeaderBanner>

    <Wrapper>
      <div class="columns">
        <MoleculeSRPCard
          class="column"
          :key="spot.ID"
          v-for="spot in spots"
          :spot="spot"
        ></MoleculeSRPCard>
      </div>
    </Wrapper>

    <section>
      {{ nearByText }}
    </section>
  </div>
</template>

<script>
import HeaderBanner from "../extras/HeaderBanner.vue";
import SearchInput from "../extras/SearchInput.vue";
import AtomHeadings from "../atoms/AtomHeadings.vue";
import MoleculeSRPCard from "../molecules/MoleculeSRPCard.vue";
import Wrapper from "../extras/Wrapper.vue";
export default {
  name: "TemplateNearBy",
  components: {
    HeaderBanner,
    SearchInput,
    AtomHeadings,
    MoleculeSRPCard,
    Wrapper,
  },
  props: {
    nearByLocation: {
      type: String,
    },
    spots: {
      type: Array,
    },
  },
  data() {
    return {};
  },
  computed: {
    nearByText() {
      return `
       Searching parking space near ${this.nearByLocation}  ? Book the cheap and best space for yourself near  ${this.nearByLocation}  with ParkSpot.
       With us, you can leave the uncertainty of not finding parking space for your Car or Bike. 
       We do short term as well as long term parking as per your need with the minimum cost. 
       Choose the new way of parking near  ${this.nearByLocation}  , choose the smart way of parking, CHOOSE ParkSpot .
       Think about the stress avoided, fuel & time saved.`;
    },
    locationWithCaps() {
      return (
        this.nearByLocation.charAt(0).toUpperCase() +
        this.nearByLocation.slice(1)
      );
    },
  },
};
</script>

<style scoped>
.custom-title {
  text-align: center;
  margin-bottom: 1rem;
}
</style>
