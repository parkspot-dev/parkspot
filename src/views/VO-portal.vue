<template>
  <div class="new_portal">
    <t-vo-portal v-if="!show" :map-show="mapShow" @submit="onSubmit" />
    <div v-if="show" class="ps_thank">
      <atom-img :src="img" />
      <atom-b-title class="is-size-3" :text="msg" />
      <atom-b-subtitle class="is-size-4" :text="msg2" />
    </div>
    <br />
  </div>
</template>
<script>
import AtomImg from "../components/atoms/atom-img/atom-img.vue";
import AtomBSubtitle from "../components/atoms/atom-text/atom-b-subtitle.vue";
import AtomBTitle from "../components/atoms/atom-text/atom-b-title.vue";
import tVoPortal from "../components/templates/t-vo-portal.vue";
import mapbox from "../thirdparty/mapbox";
export default {
  name: "VOPortal",
  components: { tVoPortal, AtomImg, AtomBTitle, AtomBSubtitle },
  data() {
    return {
      msg: "Thank You!",
      msg2: "Our supply team will soon contact you with right Parking Spot.",
      img: require("@/assets/img/request-sent.svg"),
      show: false,
      mapShow: false,
    };
  },
  created() {
    mapbox.addMapboxScript();
  },
  mounted() {
    setTimeout(() => {
      this.mapShow = true;
    }, 1000);
  },
  methods: {
    async onSubmit(data) {
      await fetch("https://maya.parkspot.in/owner/parking-request", {
        method: "Post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: data.fullName,
          Mobile: data.mno,
          EmailID: data.email,
          Country: data.country,
          State: data.state,
          City: data.city,
          Latitude: data.mapPosLat,
          Longitude: data.mapPosLng,
          CarModel: data.carModel,
          Duration: data.duration,
          Landmark: data.location,
        }),
      });
      this.show = true;
    },
  },
};
</script>
<style scoped>
.new_portal {
  background-color: #ececec;
}
.ps_thank {
  text-align: center;
  padding: 50px;
}
</style>
