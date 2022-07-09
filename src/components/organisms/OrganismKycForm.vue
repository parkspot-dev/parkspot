<template>
  <ValidationObserver ref="observer" v-slot="{}">
    <MoleculeRadioButton
      :fieldName="'radio'"
      :rules="validation.radio"
      :values="radioValues"
      @data="updateRadioData"
    >
      Are you the Owner?
    </MoleculeRadioButton>
    <MoleculeSelectInput
      :fieldName="'input'"
      :list="documentValues"
      @input="updateDocumentData"
      :rules="validation.documentSelect"
      :placeholder="'Select documents'"
      :label="'Documents'"
      :tooltip="true"
      :tooltipMsg="KYC.DOCUMENT_INFO_MSG"
    ></MoleculeSelectInput>
    <MoleculeUpload
      @data="updateImg"
      :fieldName="'document'"
      :rules="validation.img"
    ></MoleculeUpload>
  </ValidationObserver>
</template>

<script>
import { ValidationObserver } from "vee-validate";
import MoleculeRadioButton from "../molecules/MoleculeRadioButton.vue";
import MoleculeSelectInput from "../molecules/MoleculeSelectInput.vue";
import MoleculeUpload from "../molecules/MoleculeUpload.vue";
import { mapMutations } from "vuex";
import { KYC } from "../../constant/constant";
export default {
  name: "OrganismKycForm",
  components: {
    ValidationObserver,
    MoleculeRadioButton,
    MoleculeSelectInput,
    MoleculeUpload,
  },
  props: {
    formSubmitted: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["formValidate"],
  data() {
    return {
      KYC,
      radioValues: KYC.RADIO_DATA,
      documentValues: KYC.DOCUMENT_DATA,
      validation: {
        radio: "required",
        documentSelect: "required",
        img: "required|image",
      },
      model: {
        radioData: "",
        documentData: null,
        imgData: null,
      },
    };
  },
  watch: {
    formSubmitted(newVal) {
      if (newVal) {
        this.$refs.observer
          .validate()
          .then((el) => {
            if (el) {
              this.$emit("formValidate", el);
              this.submit();
            } else {
              this.$emit("formValidate", el);
            }
          })
          .catch((er) => {
            console.log(er);
          });
      }
    },
  },
  methods: {
    ...mapMutations({
      updateKyc: "soportal/update-kyc",
    }),
    submit() {
      this.updateKyc(this.model);
    },
    updateRadioData(data) {
      data === "Yes"
        ? (this.model.radioData = true)
        : (this.model.radioData = false);
    },
    updateDocumentData(data) {
      this.model.documentData = data.name;
    },
    updateImg(data) {
      this.model.imgData = data;
    },
  },
};
</script>

<style></style>
