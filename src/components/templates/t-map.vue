<template>
  <section class="t_map hero">
    <div class="hero-body">
      <m-search-box
        @search="search"
        @flytosrp="flyToSrp"
        :results="results"
        class="ps_search"
      />
      <div class="ps_map"></div>
    </div>
  </section>
</template>

<script>
import mSearchBox from "@/components/molecules/m-search-box.vue";
import AtomImg from "@/components/atoms/atom-img/atom-img.vue";
export default {
  components: { mSearchBox, AtomImg },
  name: "t-map",
  data() {
    return {
      results: [],
      cresults:[]
    };
  },
  methods: {
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
      this.cresults = data.features
      this.results = data.features.map((e) => e.place_name);
    },
    flyToSrp(value) {
      console.log(value)
      var lng = null;
      var lat = null;
      for (var i = 0; i < this.cresults.length; i++) {
        if (this.cresults[i].place_name === value) {
          lng = this.cresults[i].center[0];
          lat = this.cresults[i].center[1];
          break;
        }
      }
      this.$router.push({ name: "PSSrp", query: { lat: lat, lng: lng } });
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
  background-image: url("../../assets/img/mobile-home-map.svg");
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
.ps_searchbox {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
.ps_searchbox_list {
  border: 1px solid #ddd;
  margin-top: -1px; /* Prevent double borders */
  background-color: #f6f6f6;
  padding: 12px;
  text-decoration: none;
  font-size: 12px;
  color: black;
  display: block;
}
.ps_searchbox_list:hover {
  background-color: #eee;
}

@media only screen and (min-width: 1024px) {
  .t_map {
    height: 80vh;
  }
  .ps_map {
    background-image: url("../../assets/img/home-map.svg");
    min-height: 85vh;
  }
}
</style>