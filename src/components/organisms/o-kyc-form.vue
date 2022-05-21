<template>
  <div class="ps-kyc-form" @input="handleInput">
    <div class="owner-form">
      <p class="owner-form-title">Are you the Owner?</p>
      <div class="control owner-picker">
        <label class="radio">
          <input
            id="1"
            v-model="kycInfo.owner"
            type="radio"
            name="choose-owner"
            value="1"
          />
          Yes
        </label>
        <label class="radio">
          <input
            id="0"
            v-model="kycInfo.owner"
            type="radio"
            name="choose-owner"
            value="0"
          />
          No
        </label>
      </div>
    </div>
    <atom-input
      v-if="kycInfo.owner == false"
      v-model="kycInfo.OwnerName"
      class="textbox-input"
      types="text"
      placeholder="Owner Name"
    />
    <div class="form-id-proof">
      <p class="id-proof-title">ID Proof:-</p>
      <atom-select
        v-model="kycInfo.ownershipDefault"
        class="select"
        :values="ownershipList"
      />

      <div class="form-file">
        <div class="file has-name is-fullwidth">
          <label class="file-label">
            <input
              class="file-input"
              type="file"
              name="resume"
              @change="uploadFile"
            />
            <span class="file-cta">
              <span class="file-icon">
                <i class="fas fa-upload"></i>
              </span>
              <span class="file-label"> Choose a file… </span>
            </span>
            <span v-if="kycInfo.ownershipFile !== null" class="file-name">
              {{ kycInfo.ownershipFile.name }}
            </span>
            <span v-else class="file-name"> example.jpg </span>
          </label>
        </div>
      </div>
    </div>

    <div class="form-amenities">
      <p class="amenities-title">Amenities:-</p>
      <div class="amenities-checkbox">
        <label class="checkbox" for="Covered">
          <input
            id="Covered"
            v-model="kycInfo.checkedAmenities"
            type="checkbox"
            value="Covered"
          />
          Covered
        </label>
        <label class="checkbox" for="Gated">
          <input
            id="Gated"
            v-model="kycInfo.checkedAmenities"
            type="checkbox"
            value="Gated"
          />
          Gated
        </label>
        <label class="checkbox" for="CCTV">
          <input
            id="CCTV"
            v-model="kycInfo.checkedAmenities"
            type="checkbox"
            value="CCTV"
          />
          CCTV Camera
        </label>
        <label class="checkbox" for="Security Guard">
          <input
            id="Security Guard"
            v-model="kycInfo.checkedAmenities"
            type="checkbox"
            value="Security Guard"
          />
          Security Guard
        </label>
        <label class="checkbox" for="others">
          <input
            id="others"
            v-model="kycInfo.checkedAmenities"
            type="checkbox"
            value="others"
          />
          Others
        </label>
      </div>
    </div>

    <!-- no. of spot available -->
    <atom-select
      v-model="kycInfo.noOfSpotDefault"
      class="select"
      :values="noOfSpot"
    />

    <!-- minimum duration if any -->
    <atom-select
      v-model="kycInfo.durationDefault"
      class="select"
      :values="durationList"
    />

    <atom-input
      v-model="kycInfo.rent"
      class="input textbox-input"
      :placeholder="'Expected Monthly Rent(Exclusive our Service Charge)'"
    />
  </div>
</template>

<script>
import atomSelect from "../atoms/atom-select/atom-select.vue";
import atomInput from "../atoms/atom-input/atom-input.vue";
export default {
  components: { atomSelect, atomInput },
  emits: ["input", "kyc-info"],
  props: ["kycInfo"],
  data() {
    return {
      // kycInfo: this.kycInfo,
      ownershipList: [
        "Adhaar Card",
        "Electricity Bill",
        "Driving License",
        "Rent Agreement",
        "Others",
      ],
      durationList: [
        "Minimum duration if any",
        "Less than 1 month",
        "2 - 3 months",
        "3 - 6 months",
        "6 - 9 months",
        "More than 9 months",
      ],
      noOfSpot: ["Please specify the no. of spot", "1", "2", "3", "3+"],
    };
  },
  methods: {
    uploadFile(e) {
      // this.kycInfo.ownershipFile = e.target.files[0];
      // this.check();
      this.kycInfo.ownershipFile = e.target.files[0];
    },
    handleInput() {
      this.$emit("update:kyc-info", this.kycInfo);
      this.$emit("submit");
    },
  },
};
</script>

<style scoped>
.ps-kyc-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;
}
.owner-form {
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
}
.owner-picker {
  justify-self: start;
  display: flex;
  justify-content: space-evenly;
  gap: 10rem;
}
.form-id-proof {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 3rem;
  row-gap: 1rem;
}

.id-proof-title {
  grid-column: 1 / -1;
  font-weight: 500;
}

.form-file {
  align-self: center;
}
.form-amenities {
  grid-column: 1 /-1;
}

.amenities-title {
  font-weight: 500;
  margin-bottom: 1rem;
}
.amenities-checkbox {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}
.textbox-input {
  grid-column: 1 /-1;
}
</style>
