<template>
  <div class="o_srp">
    <m-loading-page v-if="!show" style="height: 100vh; position: relative" />
    <div class="columns reverse-columns">
      <!-- <div class="column"></div> -->
      <div class="column is-4 mt-4 mx-4">
        <div class="columns reverse-columns-custom">
          <div class="column" style="align-self: center">
            <div class="card-footer pb-0 pt-3">
              <jw-pagination
                :items="srpResults"
                :page-size="3"
                :max-pages="5"
                :labels="customLabels"
                :styles="defaultStyles"
                @changePage="onChangePage"
              ></jw-pagination>
            </div>
          </div>
          <div class="column">
            <MoleculeSRPCard
              v-for="srp in pageOfItems"
              :key="srp.ID"
              :spot="srp"
            ></MoleculeSRPCard>
            <!-- <m-srpcard
              v-for="srp in pageOfItems"
              :key="srp.ID"
              :distance="srp.Distance"
              :img="srp.IconURL"
              :location="srp.Address"
              :rate="srp.Fee.BaseAmount"
              :slots="srp.SlotsAvailable"
              :title="srp.Name"
              :vehicle="srp.VehicleType"
              :rating="srp.Rating"
              :site-id="srp.ID"
              :log="srp"
              @on-book="onBook"
            /> -->
          </div>
        </div>
      </div>
      <m-empty-page v-if="errorPage" :error="errorData" />

      <div class="column is-8">
        <m-mapbox v-if="show" :popup-info="srpResults" :center="center" />
        <m-search-box v-if="show" class="ps_search" @flytosrp="flyToSrp" />
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

// import mSrpcard from "@/components/molecules/m-srpcard.vue";
import mSearchBox from "@/components/molecules/m-search-box.vue";
import MMapbox from "../molecules/m-mapbox.vue";
import MEmptyPage from "../molecules/m-empty-page.vue";
import MLoadingPage from "../molecules/m-loading-page.vue";
import MoleculeSRPCard from "../molecules/MoleculeSRPCard.vue";
import { mayaClient } from "@/services/api.js";

export default {
  name: "OSrp",
  components: {
    // mSrpcard,
    mSearchBox,
    MMapbox,
    MEmptyPage,
    MLoadingPage,
    MoleculeSRPCard,
  },

  data() {
    return {
      defaultStyles,
      customLabels,
      pageOfItems: [],
      srpResults: [],
      markers: [],
      center: "",
      show: false,
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

    const data = await mayaClient.get(
      `/search?lat=${center[1]}&long=${center[0]}&start=20201115t1250&end=20201115t1400`
    );
    if (data && Object.prototype.hasOwnProperty.call(data, "Sites")) {
      this.srpResults = data.Sites;
      this.center = this.calculateCentroid(this.srpResults);
      this.show = true;
    }
    //TODO: handle failure cases.
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
      return queryParam.get("lat");
    },
    getLng: function () {
      var queryParam = new URLSearchParams(window.location.search);
      return queryParam.get("lng");
    },
    // calculate center avg
    calculateCentroid: function (sites) {
      var ys = sites.reduce((long, site) => {
        return long + site.Long;
      }, 0);
      var xs = sites.reduce((a, site) => {
        return a + site.Lat;
      }, 0);
      return [ys / sites.length, xs / sites.length];
    },

    flyToSrp(location) {
      var lng = location.lng;
      var lat = location.lat;
      this.$router
        .push({ name: "srp", query: { lat: lat, lng: lng } })
        .catch((err) => {
          console.error("flyToSrp err", err);
        });
    },

    onBook(index) {
      this.$emit("on-book", index);
    },
  },
};
</script>

<style>
/* can NOT make is scoped, becuase of pagination styles*/
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

.pagination .active .page-link {
  background: var(--primary-color);
  color: var(--secondary-color);
  font-weight: bold;
}
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
