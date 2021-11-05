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
          <!-- <atom-input
            v-model="userForm.location"
            class="input"
            :placeholder="address.location"
            :required="required"
          /> -->
          <m-search-box
            @search="search"
            @flytosrp="flytosrp"
            :results="results"
            :fieldName="address.location"
          />
        </div>
      </div>
      <div>
        <label class="is-size-5 is-size-6-mobile"
          >Map:Drag the Marker to pin point your location
        </label>
        <m-mapbox
          style="height: 350px"
          :key="map.key"
          :center="center"
          :data="marker"
          :zoom="zoom"
          :drag="map.drag"
          @location="getLocation"
          v-if="mapShow"
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
        <atom-button
          class="button is-warning"
          :class="{ 'is-loading': toggle }"
          :text="submit"
        />
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
import MSearchBox from "../molecules/m-search-box.vue";
export default {
  components: {
    atomInput,
    atomSelect,
    AtomButton,
    AtomBTitle,
    MMapbox,
    MSearchBox,
  },
  props: {
    mapShow: Boolean,
  },
  name: "o-vo-details",
  data() {
    return {
      toggle: false, // submit animation flag
      results: [],
      cresults: [],
      map: {
        temp: [77.586588, 12.969906],
        temp2: [[77.586588, 12.969906]],
        drag: true,
        key: 0,
        zooms: 11,
      },

      title: "Fill the form to Request your Parking Spot",
      required: true,
      submit: "Submit Request",
      contact: {
        fullName: "Full Name",
        mno: "Mobile No.",
        email: "Email ID (Optional)",
        emailType: "email",
        mobileType: "tel",
      },
      address: {
        City: "City",
        countryList: ["India"],
        stateList: ["Karnataka"],
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
  computed: {
    center() {
      if (this.userForm.location) {
        return this.map.temp;
      }
      return this.map.temp;
    },
    marker() {
      if (this.userForm.location) {
        return this.map.temp2;
      }
      return this.map.temp2;
    },
    zoom() {
      if (this.userForm.location) {
        return (this.zooms = 13);
      }
      return this.zooms;
    },
  },
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
.ps_center {
  text-align: center;
}
</style>