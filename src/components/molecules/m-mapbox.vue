<template>
  <div id="m_mapbox"></div>
</template>

<script>
import mapboxgl from "mapbox-gl";

export default {
  name: "MMapbox",
  props: {
    center: Array,
    popupInfo: {
      type: Array,
      default() {
        return [];
      },
      required: false,
    },
    zoom: {
      type: Number,
      default() {
        return 11;
      },
    },
    drag: {
      type: Boolean,
      default() {
        return false;
      },
    },
    isLocationPicker: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      map: null, //map for mapbox
      ltlng: "",
      img: require("@/assets/img/pstopmini.png"),
      currLocationMarker: null,
    };
  },
  mounted() {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYmZyaWVkbHkiLCJhIjoiY2p4bHd1OXdpMGFycDN0bzFiNWR4d2VyNyJ9.3hQjvgyoPoCuRx-Hqr_BFQ";

    this.createMap(this.center);

    // make a marker for each feature and add it to the map
    // popup info
    const currLocationPopup = new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h1><b>Your current/searched location</b></h1>`
    );
    this.currLocationMarker = new mapboxgl.Marker({
      draggable: this.drag,
    })
      .setPopup(currLocationPopup)
      .setLngLat(this.center)
      .addTo(this.map);
    if (this.isLocationPicker) {
      this.map.on("click", (e) => {
        this.currLocationMarker
          .setPopup(currLocationPopup)
          .setLngLat(e.lngLat)
          .addTo(this.map);
        this.$emit("location", this.currLocationMarker.getLngLat());
      });
      this.currLocationMarker.on("dragend", () => {
        this.$emit("location", this.currLocationMarker.getLngLat());
      });
    }

    for (let i = 0; i < this.popupInfo.length; i++) {
      var markerElement = document.createElement("div");
      markerElement.className = "marker";
      markerElement.style.backgroundImage = "url(" + this.img + ")";
      markerElement.style.width = "50px";
      markerElement.style.height = "50px";
      markerElement.style.backgroundSize = "110%";

      // popup info
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<h1><b>${this.popupInfo[i].Name}</b></h1><h2>Distance : ${this.popupInfo[i].Distance} Km</h2>`
      );
      // make a marker for each feature and add it to the map
      new mapboxgl.Marker(markerElement, {
        draggable: this.drag,
      })
        .setPopup(popup)
        .setLngLat([this.popupInfo[i].Long, this.popupInfo[i].Lat])
        .addTo(this.map);
    }
  },
  watch: {
    center() {
      this.flyto(this.center);
    },
  },
  methods: {
    createMap(pos) {
      this.map = new mapboxgl.Map({
        container: "m_mapbox", // container ID
        style: "mapbox://styles/mapbox/dark-v10", // style URL
        center: pos, // starting position [lng, lat]
        zoom: this.zoom, // starting zoom
      });
    },
    flyto(center) {
      this.map.flyTo({ center: center });
      this.currLocationMarker.setLngLat(this.center);
    },
  },
};
</script>

<style scoped>
#m_mapbox {
  /* position: absolute; */
  width: 100%;
  height: 100vh;
}
@media (max-width: 767px) {
  #m_mapbox {
    /* position: absolute; */
    width: 100%;
    height: 70vh;
  }
}
</style>
