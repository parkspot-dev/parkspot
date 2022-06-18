<template>
  <div class="o_vo_details">
    <div class="ps_center">
      <atom-b-title class="is-size-3 is-size-5-mobile" :text="title" />
    </div>
    <br />
    <form @submit.prevent="onSubmit">
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
      <!-- <m-contact-details
        :fullName="userForm.fullName"
        :email="userForm.email"
        :mno="userForm.mno"
      /> -->

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
          <m-search-box
            :results="results"
            :field-name="address.location"
            @flytosrp="flytosrp"
            :isLocationPicker="true"
            :center="center"
            @location="getLocation"
          />
        </div>
      </div>
      <div>
        <label class="is-size-5 is-size-6-mobile"
          >Map:Drag the Marker to pin point your location
        </label>
        <m-mapbox
          v-if="mapShow"
          :key="map.key"
          style="height: 350px"
          :center="center"
          :data="marker"
          :zoom="zoom"
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
import { inputMixins } from "../../mixins/inputMixins.js";
export default {
  name: "OVoDetails",
  components: {
    atomInput,
    atomSelect,
    AtomButton,
    AtomBTitle,
    MMapbox,
    MSearchBox,
  },
  mixins: [inputMixins], // TODO: refactor mixins
  props: {
    mapShow: Boolean,
  },
  data() {
    return {
      title: "Fill the form to Register your Parking Spot",
      location: null,
    };
  },
  computed: {
    center() {
      if (this.location) {
        return [this.location.lng, this.location.lat];
      }
      return this.map.defaultCenter;
    },
  },
  methods: {
    onSubmit() {
      this.userForm.location = this.location;
      this.toggle = true;
      this.$emit("submit", this.userForm);
    },

    getLocation(loc) {
      this.location = loc;
    },

    flytosrp(loc) {
      this.location = loc;
    },
  },
};
</script>

<style scoped>
.ps_center {
  text-align: center;
}
</style>
