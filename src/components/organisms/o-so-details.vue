<template>
  <div class="form-box">
    <h1 class="form-title">Register your parking spot</h1>
    <form @submit.prevent="">
      <div class="form-user-inputs mb-6">
        <keep-alive>
          <component
            :is="activeInputPage"
            :personalInfo="personalInfo"
            :kycInfo="kycInfo"
            :mapShow="mapShow"
            @get-map-location="getMapLocation"
          ></component>
        </keep-alive>
      </div>

      <div class="form-button">
        <atom-button
          class="form-button--left"
          :text="backBtn"
          :disabled="pageCount === 0"
          @click.native="back"
          name="normalBtn"
        ></atom-button>
        <atom-button
          class="form-button--right"
          :text="nextBtn"
          @click.native="next"
          name="submitBtn"
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
</template>

<script>
import AtomButton from "../atoms/atom-button/atom-button.vue";
import MContactDetail from "../molecules/m-contact-detail.vue";
import MKycForm from "../molecules/m-kyc-form.vue";
import MMapForm from "../molecules/m-map-form.vue";

export default {
  components: {
    AtomButton,
    MContactDetail,
    MKycForm,
    MMapForm,
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
        ownershipFile: [],
        checkedAmenities: [],
        nofspotDefault: "Please specify the no. of spot",
        durationDefault: "Minimum duration if any",
        rent: "",
      },
      mapLocation: "",
      pageCount: 0,
      nextBtn: "Next",
      backBtn: "Back",
      flag: false,
    };
  },
  computed: {
    activeInputPage() {
      if (this.pageCount === 0) {
        return "MContactDetail";
      }
      if (this.pageCount === 1) {
        return "MMapForm";
      }
      if (this.pageCount === 2) {
        return "MKycForm";
      }
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
    getMapLocation(data) {
      if (this.pageCount == 1) {
        this.mapLocation = data;
      }
    },
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
        UserName:
          "dummy_" + this.personalInfo.firstName + this.personalInfo.lastName,
        Password: "dummy@123",
        FullName: this.personalInfo.firstName + this.personalInfo.lastName,
        City: this.personalInfo.city,
        EmailID: this.personalInfo.email,
      };

      let logInData = {
        Username:
          "dummy_" + this.personalInfo.firstName + this.personalInfo.lastName,
        Password: "dummy@123",
      };
      // var blob = new Blob(this.kycInfo.ownershipFile, { type: "text/plain" });
      let convertedImgFile = await this.getConvertedData(
        this.kycInfo.ownershipFile
      );
      console.log(this.kycInfo.ownershipFile);
      let kycData = {
        ContactNo: this.personalInfo.contactNo,
        UserName: this.personalInfo.firstName + this.personalInfo.lastName,
        Owner: this.kycInfo.owner ? true : false,
        OwnerName: "n/a",
        OwnerContactNo: "n/a",
        Relationship: "n/a",
        OwnershipDocument: "n/a",
        IdentityDocument: "n/a",
        OwnershipDocumentImage: convertedImgFile,
        IdentityDocumentImage: [1, 2, 3],
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
          UserName: "noorVO", //only for logged in user
          FullName: this.personalInfo.firstName + this.personalInfo.lastName,
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
          Address: this.mapLocation,
        },
      };
      this.$emit("submit", registerData, logInData, kycData, contactData);
    },
    getConvertedData(data) {
      return new Promise((resolve, reject) => {
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
              console.log("fileByteArray");
            }

            resolve(fileByteArray);
          }
        };
      });
    },
    // getKycData() {
    //   return new Promise((resolve, reject) => {
    //     const selectedFile = this.kycInfo.ownershipFile[0];
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

    //         let data = {
    //           ContactNo: this.personalInfo.contactNo,
    //           UserName:
    //             this.personalInfo.firstName + this.personalInfo.lastName,
    //           Owner: this.kycInfo.owner,
    //           OwnerName: "n/a",
    //           OwnerContactNo: "n/a",
    //           Relationship: "n/a",
    //           OwnershipDocument: "n/a",
    //           IdentityDocument: "n/a",
    //           OwnershipDocumentImage: fileByteArray,
    //           IdentityDocumentImage: [1, 2, 3],
    //         };
    //         resolve(data);
    //       }
    //     };
    //   });
    // },
  },
};
</script>

<style scoped>
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

