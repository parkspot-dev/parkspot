<template>
  <section>
    <TemplateSrp :spots="srpResults"></TemplateSrp>
  </section>
</template>
<script>
import TemplateSrp from "../components/templates/TemplateSrp.vue";
import { mayaClient } from "../services/api";
export default {
  name: "PageSrp",
  components: {
    TemplateSrp,
  },
  data() {
    return {
      srpResults: [],
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
