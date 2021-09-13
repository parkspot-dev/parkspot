<template>
  <div id="m_mapbox"></div>
</template>

<script>
export default {
  name: "m-mapbox",
  props: {
    data: Array,
    center: Array,
    popupInfo: Array,
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
  },
  data() {
    return {
      map: "", //map for mapbox
      ltlng: "",
      img: require("@/assets/img/pstopmini.png"),
    };
  },
  mounted() {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYmZyaWVkbHkiLCJhIjoiY2p4bHd1OXdpMGFycDN0bzFiNWR4d2VyNyJ9.3hQjvgyoPoCuRx-Hqr_BFQ";

    this.repaint(this.center);
    console.log("this is popup");
    console.log(this.popupInfo);

    // var centerMarker = document.createElement("div");
    // centerMarker.className = "marker";
    // // centerMarker.style.backgroundImage = "url(" + this.img + ")";
    // centerMarker.style.width = "60px";
    // centerMarker.style.height = "60px";
    // centerMarker.style.backgroundSize = "100%";

    // // make a marker for each feature and add it to the map
    // popup info
    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h1><b>Your current/searched location</b></h1>`
    );
    var marker2 = new mapboxgl.Marker({
      draggable: this.drag,
    })
      .setPopup(popup)
      .setLngLat(this.center)
      .addTo(this.map);
    if (this.$route.name === "VOPortal") {
      this.map.on("click", (e) => {
        marker2.setPopup(popup).setLngLat(e.lngLat).addTo(this.map);
      });
    }
    var lngLat = marker2.getLngLat();
    this.ltlng = lngLat;
    this.$emit("location", this.ltlng);

    for (let i = 0; i < this.data.length; i++) {
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
      var marker = new mapboxgl.Marker(markerElement, {
        draggable: this.drag,
      })
        .setPopup(popup)
        .setLngLat(this.data[i])
        .addTo(this.map);
    }
  },
  methods: {
    repaint(pos) {
      this.map = new mapboxgl.Map({
        container: "m_mapbox", // container ID
        style: "mapbox://styles/mapbox/dark-v10", // style URL
        center: pos, //[(77.7864, 12.8576)], // starting position [lng, lat]
        zoom: this.zoom, // starting zoom
      });
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