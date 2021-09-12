<template>
  <div class="t_discover">
    <t-discover-banner class="mb-1" />
    <div class="section">
      <div class="container">
        <!-- breadcrumb -->
        <nav
          class="breadcrumb has-arrow-separator is-size-7"
          aria-label="breadcrumbs"
        >
          <ul>
            <li><atom-router-link :text="home" :link="hlink" /></li>
            <li class="is-active has-text-weight-semibold is-size-7">
              <a href="#" aria-current="page">Parking near </a>
            </li>
          </ul>
        </nav>
        <br />
        <!-- <o-srp /> -->
        <atom-text class="has-text-weight-semibold" :text="card_title" />
        <br />
        <div class="columns">
          <m-srpcard
            class="column"
            :key="srp.ID"
            v-for="srp in cardData"
            :img="srp.IconURL"
            :location="srp.Address"
            :rate="srp.Fee.Amount"
            :slots="srp.SlotsAvailable"
            :title="srp.Name"
            :vehicle="srp.VehicleType"
            :rating="srp.Rating"
            :distance="srp.Distance"
            :site-id="srp.ID"
          />
        </div>
        <br /><br />
        <m-discover />
        <br /><br />
      </div>
    </div>
  </div>
</template>
<script>
import AtomRouterLink from "../atoms/atom-link/atom-router-link.vue";
import AtomBTitle from "../atoms/atom-text/atom-b-title.vue";
import AtomText from "../atoms/atom-text/atom-text.vue";
import MDiscover from "../molecules/m-discover.vue";
import mSearchBox from "../molecules/m-search-box.vue";
import MSrpcard from "../molecules/m-srpcard.vue";
import TDiscoverBanner from "./t-discover-banner.vue";
// import OSrp from "../organisms/o-srp.vue";
export default {
  components: {
    mSearchBox,
    MSrpcard,
    MDiscover,
    AtomRouterLink,
    AtomText,
    AtomBTitle,
    TDiscoverBanner,
  },
  name: "t-discover",
  props: {
    cardData: Array,
  },
  data() {
    return {
      home: "Home",
      hlink: "Home",
      card_title: "Parking near you",
    };
  },
};
</script>
<style scoped>
.t_discover {
  background-color: #ececec;
}
</style>