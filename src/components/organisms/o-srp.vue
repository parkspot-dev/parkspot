<template>
  <div class="o_srp">
    <div style="height: 100vh; position: relative" v-if="!show">
      <vue-simple-spinner
        style="
          margin: 0;
          position: relative;
          top: 50%;
          -ms-transform: translateY(-50%);
          transform: translateY(-50%);
        "
        size="large"
        line-bg-color="#0085AD"
        line-fg-color="#ffdd57"
        message="Loading..."
      />
    </div>
    <div class="columns reverse-columns">
      <!-- <div class="column"></div> -->
      <div class="column is-4 mt-4 mx-4">
        <div class="columns reverse-columns-custom">
          <div class="column" style="align-self: center">
            <div class="card-footer pb-0 pt-3">
              <jw-pagination
                :items="srpResults"
                :pageSize="3"
                :maxPages="5"
                @changePage="onChangePage"
                :labels="customLabels"
                :styles="defaultStyles"
              ></jw-pagination>
            </div>
          </div>
          <div class="column">
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
              :log="srp"
              @on-book="onBook"
            />
          </div>
        </div>
      </div>
      <m-empty-page v-if="errorPage" :error="errorData" />

      <div class="column is-8">
        <m-mapbox
          :data="markers"
          :popupInfo="srpResults"
          :center="center"
          v-if="show"
        />
        <m-search-box
          @search="search"
          @flytosrp="flyToSrp"
          :results="results"
          class="ps_search"
          v-if="show"
        />
      </div>
    </div>
  </div>
</template>
<script>
// pagination styles
const customLabels = {
  first: "<<",
  last: ">>",
  previous: "Prev",
  next: "Next",
};
const defaultStyles = {
  ul: {
    margin: 0,
    padding: 0,
    display: "inline-block",
  },
  li: {
    listStyle: "none",
    display: "inline",
    textAlign: "center",
  },
  a: {
    cursor: "pointer",
    padding: "6px 12px",
    display: "block",
    float: "left",
    border: "1px solid #ddd",
    borderRadius: "20%",
    // colorHover: "yellow",
  },
};

import mSrpcard from "@/components/molecules/m-srpcard.vue";
import mSearchBox from "@/components/molecules/m-search-box.vue";
import MMapbox from "../molecules/m-mapbox.vue";
import MEmptyPage from "../molecules/m-empty-page.vue";
import VueSimpleSpinner from "vue-simple-spinner";
export default {
  components: { mSrpcard, mSearchBox, MMapbox, MEmptyPage, VueSimpleSpinner },
  name: "o-srp",

  data() {
    return {
      defaultStyles,
      customLabels,
      pageOfItems: [],
      srpResults: [],
      markers: [],
      center: "",
      show: false,
      // review: "112 reviews", //dummy
      results: [],
      cresults: [],
      errorPage: false,
      errorData: "",
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
    NProgress.start();
    const res = await fetch(
      `https://maya.parkspot.in/search?lat=${center[1]}&long=${center[0]}&start=20201115t1250&end=20201115t1400`
    );

    const data = await res.json();
    if (data.Sites === null) {
      console.log(data);
      this.errorPage = !this.errorPage;
      this.errorData = data.DisplayMsg;
    }
    for (let i = 0; i < data.Sites.length; i++) {
      this.srpResults.push(data.Sites[i]);
      let temp1 = Number(data.Sites[i].Long);
      let temp2 = Number(data.Sites[i].Lat);
      this.markers.push([temp1, temp2]);
    }
    this.center = this.calculateCentroid(this.markers);
    this.show = true;
    NProgress.done();
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
    },
    getLng: function () {
      var queryParam = new URLSearchParams(window.location.search);
      console.log(queryParam.get("lng"));
      return queryParam.get("lng");
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
      var lng = null;
      var lat = null;
      for (var i = 0; i < this.cresults.length; i++) {
        if (this.cresults[i].place_name === value) {
          lng = this.cresults[i].center[0];
          lat = this.cresults[i].center[1];
          break;
        }
      }
      console.log(this.$route);
      this.$router
        .push({ name: "srp", query: { lat: lat, lng: lng, loc: value } })
        .catch((err) => {});
    },
    onBook(index) {
      this.$emit("on-book", index);
    },
  },
};
</script>

<style scoped>
.ps_search {
  position: absolute;
  width: 30%;
  z-index: 1;
  top: 15%;
  left: 55%;
}
/* pagination styles */
/* .pagination - Pagination component container (ul element)
.pagination li - All list items in the pagination component
.pagination li a - All pagination links including first, last, previous and next
.pagination li.page-number - All page numbers (1, 2, 3 etc) pagination elements
.pagination li.first - The 'First' pagination element
.pagination li.last - The 'Last' pagination element
.pagination li.previous - The 'Previous' pagination element
.pagination li.next - The 'Next' pagination element */

.reverse-columns-custom {
  flex-direction: column;
  display: flex;
}
@media (max-width: 767px) {
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