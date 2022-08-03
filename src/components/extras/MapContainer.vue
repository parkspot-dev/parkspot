<template>
  <div id="map" style="min-height: 450px"></div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "MapContainer",
  props: {
    /**
     * map drag option for form only
     */
    drag: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["location"],
  data() {
    return {
      accessToken: process.env.VUE_APP_MAP_ACCESS_TOKEN,
      img: require("@/assets/pstopmini.png"),
      map: null, // map for mapbox
      marker: null, // marker for location
    };
  },
  computed: {
    ...mapGetters({
      mapConfig: "map/getMapConfig",
      mapCenter: "map/getNewMapCenter",
    }),
  },
  watch: {
    mapCenter(newCenter) {
      this.reCenterMap(newCenter);
    },
  },
  mounted() {
    mapboxgl.accessToken = this.accessToken;

    // create map
    this.map = new mapboxgl.Map(this.mapConfig);

    // create the popup
    const popup = new mapboxgl.Popup({ offset: 25 }).setText(
      "Your current location."
    );

    // create DOM element for the marker
    var markerElement = document.createElement("div");
    markerElement.className = "marker";
    markerElement.style.backgroundImage = "url(" + this.img + ")";
    markerElement.style.width = "50px";
    markerElement.style.height = "50px";
    markerElement.style.backgroundSize = "110%";

    // create the marker
    this.marker = new mapboxgl.Marker(markerElement, {
      draggable: this.drag,
    })
      .setLngLat(this.mapConfig.center)
      .setPopup(popup)
      .addTo(this.map);
    if (this.drag) {
      this.map.on("click", (e) => {
        this.marker.setPopup(popup).setLngLat(e.lngLat).addTo(this.map);
        this.updateMapConfig(this.marker.getLngLat());
        this.$emit("location", this.marker.getLngLat());
      });
      this.marker.on("dragend", () => {
        this.updateMapConfig(this.marker.getLngLat());
        this.$emit("location", this.marker.getLngLat());
      });
    }
  },
  methods: {
    ...mapMutations({
      updateMapConfig: "map/update-map-config",
    }),
    reCenterMap(center) {
      this.map.flyTo({
        center: center,
      });
      this.marker.setLngLat(center);
    },
  },
};
</script>

<style lang="scss" scoped>
#map {
  width: 100%;
}
</style>
