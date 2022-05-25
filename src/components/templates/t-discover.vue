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
              <a href="#" aria-current="page">Parking near {{ place }} </a>
            </li>
          </ul>
        </nav>
        <br />

        <atom-text
          class="has-text-weight-semibold"
          :text="card_title"
          :text-right="show ? emptyMsg : ''"
        />
        <!--empty msg  -->

        <figure style="text-align: center" class="mt-2">
          <atom-img v-if="show" style="width: 250px" :src="emptyImg" />
        </figure>

        <br />
        <div v-if="!show" class="columns">
          <m-srpcard
            v-for="srp in cardData"
            :key="srp.ID"
            class="column"
            :img="srp.IconURL"
            :location="
              srp.Address.slice(0, 36) +
              (srp.Address.slice(36).length > 0 ? filler : empty)
            "
            :rate="srp.Fee.Amount"
            :slots="srp.SlotsAvailable"
            :title="
              srp.Name.slice(0, 24) +
              (srp.Name.slice(24).length > 0 ? filler : empty)
            "
            :vehicle="srp.VehicleType"
            :rating="srp.Rating"
            :distance="srp.Distance"
            :site-id="srp.ID"
            :disabled="srp.SlotsAvailable === 0 ? true : false"
          />
        </div>
        <br /><br />
        <m-discover :searched-text="place" />
        <br /><br />
      </div>
    </div>
  </div>
</template>
<script>
import AtomImg from "../atoms/atom-img/atom-img.vue";
import AtomRouterLink from "../atoms/atom-link/atom-router-link.vue";
import AtomText from "../atoms/atom-text/atom-text.vue";
import MDiscover from "../molecules/m-discover.vue";
import MSrpcard from "../molecules/m-srpcard.vue";
import TDiscoverBanner from "./t-discover-banner.vue";
// import OSrp from "../organisms/o-srp.vue";
export default {
  name: "TDiscover",
  components: {
    MSrpcard,
    MDiscover,
    AtomRouterLink,
    AtomText,
    TDiscoverBanner,
    AtomImg,
  },
  props: {
    cardData: Array,
    searchedText: String,
    show: Boolean,
  },
  data() {
    return {
      home: "Home",
      hlink: "Home",
      card_title: "Parking near you",
      filler: "...",
      empty: "",
      emptyImg: require("../../assets/stocks/empty.png"),
      emptyMsg: " is currently not available!!",
    };
  },
  computed: {
    place() {
      // ** it will remove the text after '/' like 'marathahalli/dsjl' to 'marathahalli'
      const temp = this.searchedText.indexOf("/");
      if (temp > 0) {
        return this.searchedText.substring(0, temp);
      }
      return this.searchedText;
    },
  },
};
</script>
<style scoped>
.t_discover {
  background-color: #ececec;
}
</style>
