<template>
  <section class="ps-so-portal-section">
    <t-so-portal @submit="onSubmit" v-if="!show" :mapShow="mapShow" />
    <!-- rename show variable to submitted-->
    <div class="ps_thank" v-if="show">
      <atom-img :src="img" />
      <atom-b-title class="is-size-3" :text="msg" />
      <atom-b-subtitle class="is-size-4" :text="msg2" />
    </div>
  </section>
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
      const res = await fetch("https://maya.parkspot.in/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });
      if (!res.ok) {
        console.log({ res });
        throw Error("Registration Not Working!!");
      }
    },
    async login(logInData) {
      const res = await fetch("https://maya.parkspot.in/auth/login", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logInData),
      });
      if (!res.ok) {
        console.log({ res });
        throw Error("Log In Not Working!!");
      }
    },
    async kyc(kycData) {
      const res = await fetch("https://maya.parkspot.in/kyc", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },        
        method: "PATCH",
        body: JSON.stringify(kycData),
      });
      if (!res.ok) {
        console.log({ res });
        throw Error("KYC Not Working!!");
      }
    },
    async contact(contactData) {
      const res = await fetch("https://maya.parkspot.in/contact", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });
      if (!res.ok) {
        console.log({ res });
        throw Error("Contact Us Not Working!!");
      }
    },
    async onSubmit(registerData, logInData, kycData, contactData) {
      try {
        await this.register(registerData);
        await this.login(logInData);
        await this.kyc(kycData);
        await this.contact(contactData); // todo contact can be fired in parallel
      } catch (error) {
        console.error({ error });
      }
      this.show = true;
    },
  },
};
</script>
<style scoped>
.ps_thank {
  text-align: center;
  padding: 50px;
}

/* new CSS */
.ps-so-portal-section {
  /* padding: 9.6rem auto; */
  background-color: #fffcee;
  padding: 9.6rem 0;
}
</style>