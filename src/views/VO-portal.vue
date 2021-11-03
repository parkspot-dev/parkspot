<template>
  <div class="new_portal">
    <t-vo-portal @submit="onSubmit" v-if="!show" />
    <div class="ps_thank" v-if="show">
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
  components: { tVoPortal, AtomImg, AtomBTitle, AtomBSubtitle },
  name: "VO-portal",
  data() {
    return {
      msg: "Thank You!",
      msg2: "Our supply team will soon contact you with right Parking Spot.",
      img: require("@/assets/img/request-sent.svg"),
      show: false,
    };
  },
  mounted() {
    mapbox.addMapboxScript();
  },
  methods: {
    async onSubmit(data) {
      const res = await fetch(
        "https://maya.parkspot.in/owner/parking-request",
        {
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
          }),
        }
      );
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