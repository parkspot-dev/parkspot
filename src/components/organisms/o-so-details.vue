<template>
  <div class="o_so_details">
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
      <!-- Additional info for SO -->
      <label class="is-size-5 is-size-6-mobile"
        >Are you the Owner of the Spot?</label
      >
      <br />
      <div class="control">
        <label class="radio" for="yes">
          <input type="radio" id="yes" value="yes" v-model="ownershipPicked" />
          Yes</label
        >
        <br />

        <label class="radio" for="no">
          <input type="radio" id="no" value="no" v-model="ownershipPicked" />
          No</label
        >
      </div>
      <br />
      <div v-if="ownershipPicked === 'no'">
        <label class="is-size-5 is-size-6-mobile"
          >Owner's Contact Details <span style="color: red">*</span> :</label
        >
        <div class="columns">
          <div class="column">
            <atom-input
              v-model="owner.fullName"
              class="input"
              :placeholder="contact.fullName"
              :required="required"
            />
          </div>
          <div class="column">
            <atom-input
              v-model="owner.email"
              class="input"
              :placeholder="contact.email"
              :types="contact.emailType"
            />
          </div>
          <div class="column">
            <atom-input
              v-model="owner.mno"
              class="input"
              :placeholder="contact.mno"
              :required="required"
              :types="contact.mobileType"
            />
          </div>
        </div>
      </div>
      <br />
      <div>
        <label class="is-size-5 is-size-6-mobile">Ownership Proof</label>
        <atom-select
          v-model="ownershipDefault"
          class="select"
          :values="ownershipList"
        />
        <br />
        <br />
        <div style="border-style: solid" @dragover.prevent @drop.prevent>
          <input type="file" multiple @change="uploadFile" />
          <div
            @drop="dragFile"
            style="background-color: green; margin-bottom: 10px; padding: 10px"
          >
            Or drag the file here
            <div v-if="ownershipFile.length">
              <ul v-for="file in ownershipFile" :key="file">
                <li>{{ file.name }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
      <div>
        <label class="is-size-5 is-size-6-mobile">Amenities</label>
        <br />
        <div class="columns is-flex-wrap-wrap">
          <div class="column is-one-third">
            <label class="checkbox" for="Covered"
              ><input
                type="checkbox"
                id="Covered"
                value="Covered"
                v-model="checkedAmenities"
              />
              Covered</label
            >
          </div>
          <div class="column is-one-third">
            <label class="checkbox" for="Gated"
              ><input
                type="checkbox"
                id="Gated"
                value="Gated"
                v-model="checkedAmenities"
              />
              Gated</label
            >
          </div>

          <div class="column is-one-third">
            <label class="checkbox" for="CCTV">
              <input
                type="checkbox"
                id="CCTV"
                value="CCTV"
                v-model="checkedAmenities"
              />
              CCTV Camera</label
            >
          </div>

          <div class="column is-one-third">
            <label class="checkbox" for="Security Guard">
              <input
                type="checkbox"
                id="Security Guard"
                value="Security Guard"
                v-model="checkedAmenities"
              />
              Security Guard</label
            >
          </div>

          <div class="column is-one-third">
            <label class="checkbox" for="others"
              ><input
                type="checkbox"
                id="others"
                value="others"
                v-model="checkedAmenities"
              />
              others</label
            >
          </div>
        </div>
        <br />
      </div>
      <div>
        <!-- no. of spot available -->
        <atom-select
          v-model="nofspotDefault"
          class="select"
          :values="nofspot"
        />
      </div>
      <br />
      <div>
        <!-- minimum duration if any -->
        <atom-select
          v-model="durationDefault"
          class="select"
          :values="durationList"
        />
      </div>
      <br />
      <div>
        <atom-input
          v-model="rent"
          class="input"
          :placeholder="'Expected Monthly Rent(Exclusive our Service Charge)'"
          :required="required"
        />
      </div>
      <br />
      <div>
        <label class="checkbox" for="terms">
          <input type="checkbox" id="terms" value="terms" v-model="terms" />
          I agree to the<router-link target="_blank" :to="{ name: 'Terms' }">
            TERMS AND CONDITIONS</router-link
          ></label
        >
      </div>
      <br />
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
import MContactDetails from "../molecules/m-contact-details.vue";
import MMapbox from "../molecules/m-mapbox.vue";
import MSearchBox from "../molecules/m-search-box.vue";
import { inputMixins } from "../../mixins/inputMixins.js";
export default {
  components: {
    atomInput,
    atomSelect,
    AtomButton,
    AtomBTitle,
    MMapbox,
    MSearchBox,
    MContactDetails,
  },
  emits: ["submit"],
  props: {
    mapShow: Boolean,
  },
  name: "o-so-details",
  mixins: [inputMixins],
  data() {
    return {
      title: "Fill the form to Register your Parking Spot",
      ownershipPicked: "",
      owner: {
        fullName: "",
        email: "",
        mno: "",
      },
      ownershipDefault: "Aadhar Card",
      ownershipList: [
        "Aadhar Card",
        "Electricity Bill",
        "Rent Agreement",
        "Passport",
        "Driving License",
        "Other...",
      ],
      ownershipFile: [],
      checkedAmenities: [],
      nofspotDefault: "No. of Spot available",
      nofspot: [
        "No. of Spot available",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10+",
      ],
      durationDefault: "Minimum Duration if Any",
      durationList: [
        "Minimum Duration if Any",
        "Less than 1 Month",
        "1 - 3 Month",
        "3 - 6 Month",
        "6 - 9 Month",
        "More than 9 Month",
      ],
      terms: "",
      rent: "",
    };
  },

  methods: {
    onSubmit() {
      let registerData = {
        UserName: "dummy_" + this.userForm.fullName,
        Password: "dummy@123",
        FullName: this.userForm.fullName,
        City: this.userForm.City,
        EmailID: this.userForm.email,
      };

      let logInData = {
        Username: "dummy_" + this.userForm.fullName,
        Password: "dummy@123",
      };

      let kycData = {
        ContactNo: this.userForm.mno,
        UserName: this.userForm.fullName,
        Owner: this.ownershipPicked === "yes" ? true : false,
        OwnerName: this.owner.fullName,
        OwnerContactNo: this.owner.mno,
        Relationship: "n/a--hardcoded",
        OwnershipDocument: "n/a--hardcoded",
        IdentityDocument: "n/a--hardcoded",
        OwnershipDocumentImage: this.ownershipFile,
        IdentityDocumentImage: [1, 2, 3],
      };

      let contactData = {
        User: {
          UserName: "noorVO", //only for logged in user
          FullName: this.userForm.fullName,
          City: this.userForm.city,
          EmailID: this.userForm.email,
          Mobile: this.userForm.mno,
        },
        Flavour: "dweb", //android, dweb, mweb
        Comments: "Spot Registered",
        RentDetails: {
          VehicleType: "",
          Rate: this.rent,
          MinBookingDuration: this.durationDefault,
          Availability: "",
          SpecialService: this.checkedAmenities, //None/Camera/Security
          TnC: this.terms,
          Address: this.userForm.location,
        },
      };
      console.log("this is the data");
      console.log(contactData);
      this.$emit("submit", registerData, logInData, kycData, contactData);
    },
    uploadFile(e) {
      this.ownershipFile = e.target.files;
    },
    dragFile(e) {
      this.ownershipFile = e.dataTransfer.files;
    },
  },
};
</script>

<style scoped>
.ps_center {
  text-align: center;
}
</style>