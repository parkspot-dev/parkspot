<template>
  <div id="m_mapbox"></div>
</template>

<script>
export default {
  name: "m-mapbox",
  props: {
    data: Array,
    center: Array,
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
    for (let i = 0; i < this.data.length; i++) {
      // geojson.features.forEach(function (marker) {
      //   // create a HTML element for each feature
      var el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundImage = "url(" + this.img + ")";
      el.style.width = "60px";
      el.style.height = "60px";
      el.style.backgroundSize = "100%";

      // make a marker for each feature and add it to the map
      var marker = new mapboxgl.Marker(el, {
        // color: "#ffdd57"
        draggable: this.drag,
      })
        .setLngLat(this.data[i])
        .addTo(this.map);
      // });

      marker.on("dragend", () => {
        var lngLat = marker.getLngLat();
        this.ltlng = lngLat;
        this.$emit("location", this.ltlng);
      });
    }
  },
  methods: {
    repaint(pos) {
      this.map = new mapboxgl.Map({
        container: "m_mapbox", // container ID
        style: "mapbox://styles/mapbox/dark-v10", // style URL
        center: pos, //[(77.7864, 12.8576)], // starting position [lng, lat]
        zoom: 11, // starting zoom
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