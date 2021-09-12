<template>
  <div class="t_discover_banner">
    <div class="section">
      <div class="container">
        <atom-b-title
          class="is-size-3 is-size-4-mobile has-text-weight-bold"
          :text="banner_title"
        />
        <br />
        <m-search-box
          class="search"
          @search="search"
          @flytosrp="flytosrp"
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
    flytosrp(result) {
      this.userForm.location = result;
      for (let i = 0; i < this.results.length; i++) {
        if (this.results[i] === result) {
          this.map.key += 1;
          this.map.temp = [...this.cresults[i].center];
          this.map.temp2[0] = this.cresults[i].center;
        }
      }
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