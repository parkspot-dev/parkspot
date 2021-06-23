<template>
  <div class="o_srp">
    <!-- :key="card"
      v-for="card in cards" -->
    <div class="columns reverse-columns">
      <div class="column is-4 mt-4 mx-4">
        <m-srpcard
          :key="srp.ID"
          v-for="srp in pageOfItems"
          :distance="srp.Distance"
          :img="srp.IconURL"
          :location="srp.Address"
          :rate="srp.Fee.Amount"
          :slots="srp.SlotsAvailable"
          :title="srp.Name"
          :vehicle="srp.VehicleType"
          :reviews="review"
          :rating="srp.Rating"
          :site-id="srp.ID"
          @on-book="onBook"
        />
        <div class="card-footer pb-0 pt-3">
          <jw-pagination
            :items="srpResults"
            :pageSize="3"
            @changePage="onChangePage"
          ></jw-pagination>
        </div>
      </div>

      <div class="column is-8">
        <m-mapbox :data="markers" :center="center" v-if="show" />
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
// const exampleItems = [...Array(150).keys()].map((i) => ({
//   id: i + 1,
//   name: "Item " + (i + 1),
// }));
import mSrpcard from "@/components/molecules/m-srpcard.vue";
import mSearchBox from "@/components/molecules/m-search-box.vue";
import MMapbox from "../molecules/m-mapbox.vue";
export default {
  components: { mSrpcard, mSearchBox, MMapbox },
  name: "o-srp",

  data() {
    return {
      pageOfItems: [],
      srpResults: [],
      markers: [],
      center: "",
      show: false,
      review: "112 reviews", //dummy
      results: [],
      cresults: [],
    };
  },
  async mounted() {
    // Calling Maya to get SRP details from the db
    var lat = this.getLat(); //12.8576
    var lng = this.getLng(); //77.7864
    var center;

    if (lat === null || lng === null) {
      console.log("reverting to default lat long");
      center = [77.7864, 12.8576]; //fallout lat long
    } else {
      center = [Number(lng), Number(lat)];
    }

    const res = await fetch(
      `https://maya.parkspot.in/search?lat=${center[1]}&long=${center[0]}&start=20201115t1250&end=20201115t1400`
    );
    const data = await res.json();
    for (let i = 0; i < data.Sites.length; i++) {
      this.srpResults.push(data.Sites[i]);
      let temp1 = Number(data.Sites[i].Long);
      let temp2 = Number(data.Sites[i].Lat);
      this.markers.push([temp1, temp2]);
    }
    // console.log(this.srpResults);
    // console.log(`srp results${this.srpResults}`);
    // console.log(`center.....${this.center}`);
    // let temp = JSON.parse(JSON.stringify(this.markers));
    this.center = this.calculateCentroid(this.markers);
    this.show = true;

    console.log("centererw", this.center);
  },
  methods: {
    // Pagination method
    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },

    // methods to get Lat and Long
    getLat: function () {
      var queryParam = new URLSearchParams(window.location.search);
      console.log(queryParam.get("lat"));
      return queryParam.get("lat");
      // return this.$route.query.lat;
    },
    getLng: function () {
      var queryParam = new URLSearchParams(window.location.search);
      console.log(queryParam.get("lng"));
      return queryParam.get("lng");
      // return this.$route.query.lng;
    },
    // calculate center avg
    calculateCentroid: function (arr) {
      var ys = arr.reduce((a, e) => {
        return a + e[0];
      }, 0);
      console.log(typeof xs);
      var xs = arr.reduce((a, e) => {
        return a + e[1];
      }, 0);
      return [ys / arr.length, xs / arr.length];
    },

    // Calling Search from Mapbox API
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
      this.$router.push({ name: "srp", query: { lat: lat, lng: lng } });
    },
    onBook(index) {
      console.log("clicked    " + index);
      this.$emit("on-book", index);
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

@media (max-width: 767px) {
  /* <== You can change this break point as per your  needs */
  .reverse-columns {
    flex-direction: column-reverse;
    display: flex;
  }
  .ps_search {
    width: 60%;
    left: 20%;
  }
}
</style>