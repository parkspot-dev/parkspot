<template>
  <div class="map-form">
    <m-search-box
      class="form-search"
      :results="results"
      :field-name="'Search nearest location'"
      :proximity="center"
      @flytosrp="flytosrp"
    />
    <div>
      <p class="map-title">Drag the Marker to pin point your location</p>
      <m-mapbox
        v-if="mapShow"
        :key="config.mapKey"
        style="height: 350px"
        :isLocationPicker="true"
        :center="center"
        :zoom="zoom"
        :drag="config.drag"
        @location="getLocation"
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
      config: {
        zoom: 15,
        center: [77.586588, 12.969906],
        drag: true,
        mapKey: 0,
      },
      location: null,
    };
  },
  computed: {
    center() {
      if (this.location) {
        return [this.location.lng, this.location.lat];
      }
      return this.config.center;
    },
    marker() {
      if (this.location) {
        return [this.location.lng, this.location.lat];
      }
      return this.config.center;
    },
    zoom() {
      return this.config.zoom;
    },
  },
  created() {
    if (this.location) {
      this.config.zoom = 15;
    }
  },
  methods: {
    getLocation(loc) {
      this.location = loc;
    },

    flytosrp(loc) {
      this.location = loc;
      this.$emit("update:map-location", this.location);
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
