<template>
  <div class="ps-kyc-form" @input="handleInput">
    <div class="owner-form">
      <p class="owner-form-title">Are you the Owner?</p>
      <div class="control owner-picker">
        <label class="radio">
          <input
            type="radio"
            name="choose-owner"
            id="1"
            value="1"
            v-model="kycInfo.owner"
          />
          Yes
        </label>
        <label class="radio">
          <input
            type="radio"
            name="choose-owner"
            id="0"
            value="0"
            v-model="kycInfo.owner"
          />
          No
        </label>
      </div>
    </div>
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
            <span class="file-name" v-if="kycInfo.ownershipFile.length > 0">
              {{ kycInfo.ownershipFile[0].name }}
            </span>
            <span class="file-name" v-else> example.jpg </span>
          </label>
        </div>
      </div>
    </div>

    <div class="form-amenities">
      <p class="amenities-title">Amenities:-</p>
      <div class="amenities-checkbox">
        <label class="checkbox" for="Covered">
          <input
            type="checkbox"
            id="Covered"
            value="Covered"
            v-model="kycInfo.checkedAmenities"
          />
          Covered
        </label>
        <label class="checkbox" for="Gated">
          <input
            type="checkbox"
            id="Gated"
            value="Gated"
            v-model="kycInfo.checkedAmenities"
          />
          Gated
        </label>
        <label class="checkbox" for="CCTV">
          <input
            type="checkbox"
            id="CCTV"
            value="CCTV"
            v-model="kycInfo.checkedAmenities"
          />
          CCTV Camera
        </label>
        <label class="checkbox" for="Security Guard">
          <input
            type="checkbox"
            id="Security Guard"
            value="Security Guard"
            v-model="kycInfo.checkedAmenities"
          />
          Security Guard
        </label>
        <label class="checkbox" for="others">
          <input
            type="checkbox"
            id="others"
            value="others"
            v-model="kycInfo.checkedAmenities"
          />
          others
        </label>
      </div>
    </div>

    <!-- no. of spot available -->
    <atom-select
      v-model="kycInfo.nofspotDefault"
      class="select"
      :values="nofspot"
    ></atom-select>

    <!-- minimum duration if any -->
    <atom-select
      v-model="kycInfo.durationDefault"
      class="select"
      :values="durationList"
    ></atom-select>

    <atom-input
      v-model="kycInfo.rent"
      class="input rent-input"
      :placeholder="'Expected Monthly Rent(Exclusive our Service Charge)'"
    ></atom-input>
  </div>
</template>

<script>
import atomSelect from "../atoms/atom-select/atom-select.vue";
import atomInput from "../atoms/atom-input/atom-input.vue";
export default {
  components: { atomSelect, atomInput },
  emits: ["input"],
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
      nofspot: [
        "Please specify the no. of spot",
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
      ],
    };
  },
  methods: {
    uploadFile(e) {
      // this.kycInfo.ownershipFile = e.target.files[0];
      // this.check();
      this.kycInfo.ownershipFile = e.target.files[0];
    },
    handleInput() {
      this.$emit("input", this.kycInfo);
    },
    //! Please delete below
    // getConvertedData(data) {
    //   return new Promise((resolve, reject) => {
    //     const selectedFile = data;
    //     const reader = new FileReader();
    //     const fileByteArray = [];

    //     reader.readAsArrayBuffer(selectedFile);
    //     reader.onloadend = (evt) => {
    //       if (evt.target.readyState === FileReader.DONE) {
    //         const arrayBuffer = evt.target.result,
    //           array = new Uint8Array(arrayBuffer);
    //         for (const a of array) {
    //           fileByteArray.push(a);
    //           console.log("fileByteArray");
    //         }

    //         resolve(fileByteArray);
    //       }
    //     };
    //   });
    // },
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
  justify-content: space-between;
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
.rent-input {
  grid-column: 1 /-1;
}
</style>