<template>
  <div class="o_srp">
    <!-- :key="card"
      v-for="card in cards" -->
    <div class="columns">
      <div class="column is-4 mt-6 ml-4">
        <m-srpcard
          :distance="distance"
          :img="img"
          :location="location"
          :rate="rate"
          :slots="slots"
          :title="title"
          :vehicle="vehicle"
          :reviews="review"
        />
        <div class="card-footer pb-0 pt-3">
          <jw-pagination
            :items="exampleItems"
            @changePage="onChangePage"
          ></jw-pagination>
        </div>
      </div>

      <div class="column is-8">
        <m-mapbox />
        <m-search-box
          @search="search"
          @flytosrp="flyToSrp"
          :results="results"
          class="ps_search"
        />
      </div>
    </div>
  </div>
</template>
<script>
// dummy
const exampleItems = [...Array(150).keys()].map((i) => ({
  id: i + 1,
  name: "Item " + (i + 1),
}));

import mSrpcard from "@/components/molecules/m-srpcard.vue";
import mSearchBox from "@/components/molecules/m-search-box.vue";
import MMapbox from "../molecules/m-mapbox.vue";
export default {
  components: { mSrpcard, mSearchBox, MMapbox },
  name: "o-srp",
  data() {
    return {
      exampleItems, //dummy
      pageOfItems: [], //dummy
      title: "SARJAPUR Apartment",
      rate: " ₹ 1800/Month ",
      distance: " 9.73 km",
      location: "cHAMPIONS SQUARE, SARJAPUR BANGALORE",
      vehicle: "Vehicle Type: FullSize",
      slots: "Slots Available: 0/1",
      img: require("../../assets/img/default.png"),
      review: "112 reviews",
      results: [],
      cresults: [],
    };
  },
  methods: {
    // dummy
    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },
    async search(name) {
      // console.log(name)
      if (!name.length) {
        this.results = [];
        return;
      }
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${name}.json?access_token=pk.eyJ1IjoiaWFtZmlhc2NvIiwiYSI6ImNrOWZiankzdjA5d2kzbWp3NGNzNmIwaHAifQ.E2UwYdvpjc6yNoCmBjfTaQ&proximity=77.4977,12.9716`
      );
      const data = await res.json();
      this.cresults = data.features;
      this.results = data.features.map((e) => e.place_name);
    },
    flyToSrp(value) {
      console.log(value);
      var lng = null;
      var lat = null;
      for (var i = 0; i < this.cresults.length; i++) {
        if (this.cresults[i].place_name === value) {
          lng = this.cresults[i].center[0];
          lat = this.cresults[i].center[1];
          break;
        }
      }
      this.$router.push({ name: "PSSrp", query: { lat: lat, lng: lng } });
    },
  },
};
</script>

<style scoped>
.o_srp {
  background-color: #ececec;
}
.ps_search {
  position: absolute;
  width: 30%;
  z-index: 1;
  top: 15%;
  left: 55%;
}
</style>