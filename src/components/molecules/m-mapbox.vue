<template>
  <div id="m_mapbox"></div>
</template>

<script>
export default {
  name: "m-mapbox",
  data() {
    return {};
  },
  mounted() {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYmZyaWVkbHkiLCJhIjoiY2p4bHd1OXdpMGFycDN0bzFiNWR4d2VyNyJ9.3hQjvgyoPoCuRx-Hqr_BFQ";
    var map = new mapboxgl.Map({
      container: "m_mapbox", // container ID
      style: "mapbox://styles/mapbox/dark-v10", // style URL
      center: [77.7864, 12.8576], // starting position [lng, lat]
      zoom: 9, // starting zoom
    });
  },
};
</script>

<style scoped>
#m_mapbox {
  /* position: absolute; */
  width: 100vw;
  height: 100vh;
}
</style>