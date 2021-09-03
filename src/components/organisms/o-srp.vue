<template>
  <div class="o_srp">
    <div class="columns reverse-columns">
      <div class="column is-4 mt-4 mx-4">
        <div class="columns reverse-columns-custom">
          <div class="column">
            <div class="card-footer pb-0 pt-3">
              <jw-pagination
                :items="srpResults"
                :pageSize="3"
                :maxPages="5"
                @changePage="onChangePage"
                :labels="customLabels"
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
  previous: "<",
  next: ">",
};
// const customStyles = {
//   ul: {
//     border: "2px solid red",
//   },
//   li: {
//     display: "inline-block",
//     border: "2px dotted green",
//   },
//   a: {
//     color: "blue",
//   },
// };

import mSrpcard from "@/components/molecules/m-srpcard.vue";
import mSearchBox from "@/components/molecules/m-search-box.vue";
import MMapbox from "../molecules/m-mapbox.vue";
import MEmptyPage from "../molecules/m-empty-page.vue";
export default {
  components: { mSrpcard, mSearchBox, MMapbox, MEmptyPage },
  name: "o-srp",

  data() {
    return {
      // customStyles,
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
        .push({ name: "srp", query: { lat: lat, lng: lng } })
        .catch((err) => {});
    },
    onBook(index) {
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

/* pagination styles */
/* .pagination .ul li.active {
  background-color: #4caf50;
  color: white;
} */
.reverse-columns-custom {
  flex-direction: column-reverse;
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