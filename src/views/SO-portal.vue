<template>
  <section class="ps-so-portal-section">
    <t-so-portal
      v-if="!isFormSubmitted"
      :map-show="mapShow"
      @submit="onSubmit"
    />
    <div v-if="isFormSubmitted" class="ps_thank">
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
import { mayaClient } from "@/services/api";
export default {
  name: "SOPortal",
  components: { tSoPortal, AtomImg, AtomBTitle, AtomBSubtitle },
  data() {
    return {
      msg: "Thank You!",
      msg2: "Our supply team will soon contact you with right Parking Spot.",
      img: require("@/assets/img/request-sent.svg"),
      isFormSubmitted: false,
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
      mayaClient.post("/auth/register", registerData);
    },
    async login(logInData) {
      mayaClient.post("/auth/login", logInData);
    },
    async kyc(kycData) {
      mayaClient.post("/kyc", kycData);
    },
    async contact(contactData) {
      mayaClient.post("/contact", contactData);
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
      this.isFormSubmitted = true;
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
