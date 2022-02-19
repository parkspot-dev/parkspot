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
    async kyc(data) {
      console.log("this is me kyc");
      const res = await fetch("https://maya.parkspot.in/kyc", {
        method: "PATCH",
        body: JSON.stringify({
          ContactNo: data.mno,
          UserName: data.fullName, // user full name,
          Owner: data.ownershipPicked,
          // OwnerName: data.owner.fullName, // if user is not the owner,
          // OwnerContactNo: data.owner.mno,
          Relationship: data.ownershipPicked,
          OwnershipDocument: data.ownershipDefault,
          // IdentityDocument: data,
          OwnershipDocumentImage: data.ownershipFile,
          // IdentityDocumentImage: [1,2,3]
        }),
      });
    },
    async onSubmit(data) {
      this.kyc(data);
      const res = await fetch("https://maya.parkspot.in/contact", {
        method: "Post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          User: {
            UserName: "noorVO", //only for logged in user
            FullName: data.fullName,
            City: data.city,
            EmailID: data.email,
            Mobile: data.mno,
          },
          Flavour: "dweb", //android, dweb, mweb
          Comments: "Spot Registered",
          RentDetails: {
            VehicleType: "",
            Rate: data.rent,
            MinBookingDuration: data.durationDefault,
            Availability: "",
            SpecialService: data.checkedAmenties, //None/Camera/Security
            TnC: data.terms,
            Address: data.location,
          },
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