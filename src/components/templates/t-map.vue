<template>
  <section class="t_map hero">
    <div class="hero-body">
      <m-search-box class="ps_search" @search="search" @flytosrp="flyToSrp" />
      <div class="ps_map"></div>
    </div>
  </section>
</template>

<script>
import mSearchBox from "@/components/molecules/m-search-box.vue";
export default {
  name: "TMap",
  components: { mSearchBox },
  data() {
    return {
      toggleImg: false,
    };
  },
  beforeCreate() {
    this.toggleImg = false;
  },
  mounted() {
    this.toggleImg = true;
  },
  methods: {
    flyToSrp(location) {
      this.$router.push({
        name: "srp",
        query: { lat: location.lat, lng: location.lng },
      });
    },
  },
};
</script>

<style scoped>
.t_map {
  top: 0;
  position: relative;
}
.hero-body {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  height: 55vh;
  width: 100%;
}
.ps_map {
  background-image: url("../../assets/img/mobile-map-banner.webp");
  position: absolute;
  top: 0;
  left: 0;
  min-height: 60vh;
  min-width: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  z-index: -1;
}

.ps_search {
  width: 60%;
  z-index: 1;
}

@media only screen and (min-width: 720px) {
  .t_map {
    height: 80vh;
  }
  .ps_map {
    background-image: url("../../assets/img/map-banner.webp");
    min-height: 85vh;
  }
}
</style>
