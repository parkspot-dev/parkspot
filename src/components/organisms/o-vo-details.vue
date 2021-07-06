<template>
  <div class="o_vo_details">
    <div class="ps_center">
      <atom-b-title class="is-size-3 is-size-5-mobile" :text="title" />
    </div>
    <br />
    <form v-on:submit.prevent="onSubmit">
      <!-- contact details -->
      <label class="is-size-5 is-size-6-mobile"
        >Contact Details <span style="color: red">*</span> :</label
      >
      <div class="columns">
        <div class="column">
          <atom-input
            v-model="userForm.fullName"
            class="input"
            :placeholder="contact.fullName"
            :required="required"
          />
        </div>
        <div class="column">
          <atom-input
            v-model="userForm.email"
            class="input"
            :placeholder="contact.email"
            :required="required"
            :types="contact.emailType"
          />
        </div>
        <div class="column">
          <atom-input
            v-model="userForm.mno"
            class="input"
            :placeholder="contact.mno"
            :required="required"
            :types="contact.mobileType"
          />
        </div>
      </div>

      <!-- Address  -->
      <label class="is-size-5 is-size-6-mobile"
        >Address <span style="color: red">*</span> :</label
      >
      <div class="columns">
        <div class="column">
          <atom-select
            v-model="userForm.country"
            class="select"
            :values="address.countryList"
          />
        </div>
        <div class="column">
          <atom-select
            v-model="userForm.state"
            class="select"
            :values="address.stateList"
          />
        </div>
      </div>
      <div class="columns">
        <div class="column">
          <atom-input
            v-model="userForm.city"
            class="input"
            :placeholder="address.City"
            :required="required"
          />
        </div>
        <div class="column">
          <atom-input
            v-model="userForm.location"
            class="input"
            :placeholder="address.location"
            :required="required"
          />
        </div>
      </div>
      <div>
        <label class="is-size-5 is-size-6-mobile"
          >Map:Drag the Marker to pin point your location
        </label>
        <m-mapbox
          style="height: 350px"
          :center="map.temp"
          :data="map.temp2"
          :drag="map.drag"
          @location="getLocation"
        />
      </div>
      <br />
      <!-- preferences -->
      <label class="is-size-5 is-size-6-mobile">Preferences(optional) :</label>
      <div class="columns">
        <div class="column">
          <atom-input
            v-model="userForm.carModel"
            class="input"
            :placeholder="preference.carModel"
          />
        </div>
        <div class="column">
          <atom-select
            v-model="userForm.typeParking"
            class="select"
            :values="preference.typeList"
          />
        </div>
        <div class="column">
          <atom-select
            v-model="userForm.duration"
            class="select"
            :values="preference.durationList"
          />
        </div>
      </div>

      <!-- Button -->
      <div class="ps_center">
        <atom-button class="button is-warning" :text="submit" />
      </div>
    </form>
  </div>
</template>

<script>
import AtomButton from "../atoms/atom-button/atom-button.vue";
import atomInput from "../atoms/atom-input/atom-input.vue";
import atomSelect from "../atoms/atom-select/atom-select.vue";
import AtomBTitle from "../atoms/atom-text/atom-b-title.vue";
import MMapbox from "../molecules/m-mapbox.vue";
export default {
  components: { atomInput, atomSelect, AtomButton, AtomBTitle, MMapbox },
  name: "o-vo-details",
  data() {
    return {
      map: {
        temp: [77.586588, 12.969906],
        temp2: [[77.586588, 12.969906]],
        drag: true,
      },

      title: "Fill the form to Request your Parking Spot",
      required: true,
      submit: "Submit Request",
      contact: {
        fullName: "Full Name",
        mno: "Mobile No.",
        email: "Email ID",
        emailType: "email",
        mobileType: "tel",
      },
      address: {
        City: "City",
        countryList: ["India"],
        stateList: ["Karnataka", "coming soon..."],
        location: "Nearest Location Address",
      },
      preference: {
        carModel: "Car Model/Name",
        durationList: [
          "Duration",
          "Less than 1 Month",
          "1 - 3 Month",
          "3 - 6 Month",
          "6 - 9 Month",
          "More than 9 Month",
        ],
        typeList: ["Type of Parking", "Coverd Parking", "Open Parking"],
      },
      // object created for v-model /data binding
      userForm: {
        fullName: "",
        email: "",
        mno: "",
        city: "",
        country: "India",
        state: "Karnataka",
        carModel: "",
        duration: "Duration",
        typeParking: "Type of Parking",
        location: "",
        mapPosLat: "",
        mapPosLng: "",
      },
    };
  },

  methods: {
    getLocation(loc) {
      this.userForm.mapPosLat = loc.lat;
      this.userForm.mapPosLng = loc.lng;
    },
    onSubmit() {
      console.log(this.userForm);
      this.$emit("submit", this.userForm);
    },
  },
};
</script>

<style scoped>
.ps_center {
  text-align: center;
}
</style>