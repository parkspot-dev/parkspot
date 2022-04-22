<template>
  <div class="t_discover_banner">
    <div class="section">
      <div class="container">
        <atom-b-title class="has-text-weight-bold" :text="banner_title" />
        <br />
        <m-search-box
          class="search"
          @search="search"
          @flytosrp="flytoSrp"
          :results="results"
        />
      </div>
    </div>
  </div>
</template>
<script>
import atomBTitle from "../atoms/atom-text/atom-b-title.vue";
import MSearchBox from "../molecules/m-search-box.vue";
export default {
  components: { atomBTitle, MSearchBox },
  name: "t-discover-banner",
  data() {
    return {
      banner_title: "Book Your Parking Spot",
      //   todo:  Remove the below code after introducing VUEX
      cresults: "",
      results: "",
    };
  },
  //   todo: Remove the below code after introducing VUEX
  methods: {
    getLocation(loc) {
      this.userForm.mapPosLat = loc.lat;
      this.userForm.mapPosLng = loc.lng;
    },
    onSubmit() {
      console.log(this.userForm);
      this.toggle = true;
      this.$emit("submit", this.userForm);
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
    flytoSrp(value) {
      var lng = null;
      var lat = null;
      for (var i = 0; i < this.cresults.length; i++) {
        if (this.cresults[i].place_name === value) {
          lng = this.cresults[i].center[0];
          lat = this.cresults[i].center[1];
          break;
        }
      }
      this.$router
        .push({ name: "srp", query: { lat: lat, lng: lng, loc: value } })
        .catch((err) => {
          console.err("flyToSrp err", err);
        });
    },
  },
};
</script>
<style scoped>
.t_discover_banner {
  background: url("../../assets/img/discover-banner.svg");
  height: 35vh;
}
.search {
  /* width: 50%; */
  margin: auto;
}
</style>
