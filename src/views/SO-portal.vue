<template>
  <div class="new_portal">
    <t-so-portal @submit="onSubmit" v-if="!show" :mapShow="mapShow" />
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
import tSoPortal from "../components/templates/t-so-portal.vue";
import mapbox from "../thirdparty/mapbox";
export default {
  components: { tSoPortal, AtomImg, AtomBTitle, AtomBSubtitle },
  name: "SO-portal",
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
    async register(registerData) {
      await fetch("https://maya.parkspot.in/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });
    },
    async login(logInData) {
      await fetch("https://maya.parkspot.in/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logInData),
      });
    },
    async kyc(kycData) {
      await fetch("https://maya.parkspot.in/kyc", {
        method: "PATCH",
        body: JSON.stringify(kycData),
      });
    },
    async contact(contactData) {
      await fetch("https://maya.parkspot.in/contact", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });
    },
    async onSubmit(registerData, logInData, kycData, contactData) {
      await this.register(registerData);
      await this.login(logInData);
      await this.kyc(kycData);
      await this.contact(contactData);
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
