<template>
  <div class="map-form">
    <m-search-box
      class="form-search"
      @search="search"
      @flytosrp="flytosrp"
      :results="results"
      :fieldName="'Search nearest location'"
    />
    <div>
      <p class="map-title">Drag the Marker to pin point your location</p>
      <m-mapbox
        style="height: 350px"
        :key="map.key"
        :center="center"
        :data="marker"
        :zoom="zoom"
        :drag="map.drag"
        @location="getLocation"
        v-if="mapShow"
      />
    </div>
  </div>
</template>

<script>
import MSearchBox from "../molecules/m-search-box.vue";
import MMapbox from "../molecules/m-mapbox.vue";
export default {
  components: { MSearchBox, MMapbox },
  props: { mapShow: Boolean },
  data() {
    return {
      results: [],
      cresults: [],
      map: {
        temp: [77.586588, 12.969906],
        temp2: [[77.586588, 12.969906]],
        drag: true,
        key: 0,
        zooms: 11,
      },

      location: "",
      mapPosLat: "",
      mapPosLng: "",
      // mapShow: true,
    };
  },
  computed: {
    center() {
      if (this.location) {
        return this.map.temp;
      }
      return this.map.temp;
    },
    marker() {
      if (this.location) {
        return this.map.temp2;
      }
      return this.map.temp2;
    },
    zoom() {
      if (this.location) {
        return (this.zooms = 13);
      }
      return this.zooms;
    },
  },
  methods: {
    getLocation(loc) {
      this.mapPosLat = loc.lat;
      this.mapPosLng = loc.lng;
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
    flytosrp(result) {
      this.location = result;
      for (let i = 0; i < this.results.length; i++) {
        if (this.results[i] === result) {
          this.map.key += 1;
          this.map.temp = [...this.cresults[i].center];
          this.map.temp2[0] = this.cresults[i].center;
        }
      }
      this.$emit("get-map-location", this.location);
    },
  },
};
</script>

<style scoped>
.form-search {
  margin-bottom: 2rem;
}
.map-title {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 1rem;
}
</style>