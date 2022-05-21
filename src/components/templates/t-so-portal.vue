<template>
  <div class="ps-container">
    <div class="form-box">
      <h1 class="form-title">Register your parking spot</h1>
      <form @submit.prevent="">
        <div class="form-user-inputs mb-6">
          <keep-alive>
            <component
              :is="activeInputPage"
              :kyc-info="kycInfo"
              :map-show="mapShow"
              @update:personal-info="personalInfo = $event"
              @update:map-location="mapLocation = $event"
              @update:kyc-info="kycInfo = $event"
            ></component>
          </keep-alive>
        </div>

        <div class="form-button">
          <atom-button
            class="form-button--left"
            :text="backBtn"
            :disabled="pageCount === 0"
            name="normalBtn"
            @click.native="back"
          ></atom-button>
          <atom-button
            class="form-button--right"
            type="submit"
            :text="nextBtn"
            name="submitBtn"
            @click.native="next"
          ></atom-button>
        </div>
        <ul class="ps-form-indicator">
          <li
            class="ps-form-indicator-item"
            :class="pageCount === 0 ? 'ps-form-indicator-item--fill' : ''"
          >
            &nbsp;
          </li>
          <li
            class="ps-form-indicator-item"
            :class="pageCount === 1 ? 'ps-form-indicator-item--fill' : ''"
          >
            &nbsp;
          </li>
          <li
            class="ps-form-indicator-item"
            :class="pageCount === 2 ? 'ps-form-indicator-item--fill' : ''"
          >
            &nbsp;
          </li>
        </ul>
      </form>
    </div>
  </div>
</template>
<script>
import AtomButton from "../atoms/atom-button/atom-button.vue";
import OContactDetail from "../organisms/o-contact-detail.vue";
import OKycForm from "../organisms/o-kyc-form.vue";
import OMapForm from "../organisms/o-map-form.vue";

export default {
  components: {
    AtomButton,
    OContactDetail,
    OKycForm,
    OMapForm,
  },
  emits: ["submit"],
  props: { mapShow: Boolean },
  data() {
    return {
      personalInfo: {
        firstName: "",
        lastName: "",
        email: "",
        contactNo: null,
        state: "",
        city: "",
      },
      kycInfo: {
        owner: 1,
        ownershipDefault: "Adhaar Card",
        ownershipFile: {},
        checkedAmenities: [],
        noOfSpotDefault: "Please specify the no. of spot",
        durationDefault: "Minimum duration if any",
        rent: "",
      },
      mapLocation: {},
      pageCount: 0,
      nextBtn: "Next",
      backBtn: "Back",
      flag: false,
    };
  },
  computed: {
    activeInputPage() {
      if (this.pageCount === 0) {
        return "OContactDetail";
      }
      if (this.pageCount === 1) {
        return "OMapForm";
      }
      if (this.pageCount === 2) {
        return "OKycForm";
      }
      return "OContactDetail"; // default value
    },
  },
  watch: {
    pageCount() {
      if (this.pageCount === 2) {
        return (this.nextBtn = "Submit");
      } else {
        return (this.nextBtn = "Next");
      }
    },
  },
  methods: {
    next() {
      if (this.pageCount === 2) {
        this.onSubmit();
      } else {
        this.pageCount++;
      }
    },
    back() {
      this.pageCount--;
    },
    async onSubmit() {
      let registerData = {
        UserName: "dummy_" + this.personalInfo.firstName + Date.now(),
        Password: "dummy@123",
        FullName:
          this.personalInfo.firstName + " " + this.personalInfo.lastName,
        City: this.personalInfo.city,
        EmailID: this.personalInfo.email,
      };

      let logInData = {
        Username: registerData.UserName,
        Password: registerData.Password,
      };
      // var blob = new Blob(this.kycInfo.ownershipFile, { type: "text/plain" });
      let convertedImgFile = await this.getConvertedData(
        this.kycInfo.ownershipFile
      );
      let kycData = {
        ContactNo: this.personalInfo.contactNo,
        UserName: this.personalInfo.firstName + this.personalInfo.lastName,
        Owner: this.kycInfo.owner ? true : false,
        OwnerName: this.kycInfo.ownerName,
        OwnerContactNo: "n/a",
        Relationship: "n/a",
        OwnershipDocument: "n/a",
        IdentityDocument: "n/a",
        OwnershipDocumentImage: convertedImgFile,
      };

      let convertedCheckedAminities = "";
      for (let data of this.kycInfo.checkedAmenities) {
        convertedCheckedAminities += data + ",";
      }
      convertedCheckedAminities = convertedCheckedAminities.substring(
        0,
        convertedCheckedAminities.length - 1
      );
      let contactData = {
        User: {
          UserName: logInData.UserName, //only for logged in user
          FullName:
            this.personalInfo.firstName + " " + this.personalInfo.lastName,
          City: this.personalInfo.city,
          EmailID: this.personalInfo.email,
          Mobile: this.personalInfo.contactNo,
        },
        Flavour: this.$store.getters["device/getFlavour"], //android, dweb, mweb
        Comments: "Spot Registered",
        RentDetails: {
          VehicleType: "",
          Rate: this.kycInfo.rent,
          MinBookingDuration: this.kycInfo.durationDefault,
          Availability: "",
          SpecialService: convertedCheckedAminities, //None/Camera/Security
          TnC: this.terms,
          Address: this.mapLocation.address,
        },
      };
      this.$emit("submit", registerData, logInData, kycData, contactData);
    },
    getConvertedData(data) {
      if (!(data instanceof File)) {
        return null; //todo add alert
      }
      return new Promise((resolve) => {
        const selectedFile = data;
        const reader = new FileReader();
        const fileByteArray = [];

        reader.readAsArrayBuffer(selectedFile);
        reader.onloadend = (evt) => {
          if (evt.target.readyState === FileReader.DONE) {
            const arrayBuffer = evt.target.result,
              array = new Uint8Array(arrayBuffer);
            for (const a of array) {
              fileByteArray.push(a);
            }
            resolve(fileByteArray);
          }
        };
      });
    },
  },
};
</script>
<style scoped>
.ps-container {
  max-width: 80rem;
  margin: 0 auto;
}
.form-title {
  font-size: 3.25rem;
  line-height: 1.01;
  letter-spacing: -0.5px;
  margin-bottom: 3rem;
}
.form-box {
  margin: 0 10rem;
  padding: 2rem 5rem;
  background-color: #fff;
  box-shadow: 0 1px 24px rgba(0, 0, 0, 0.2);
  border-radius: 9px;
}
.form-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.form-button--left {
  justify-self: start;
}
.form-button--right {
  justify-self: end;
}
.ps-form-indicator {
  display: flex;
  justify-content: center;
  gap: 1rem;
}
.ps-form-indicator-item {
  height: 12px;
  width: 12px;
  border: 2px solid #ffdd57;
  border-radius: 50%;
}
.ps-form-indicator-item--fill {
  background-color: #ffdd57;
}
</style>
