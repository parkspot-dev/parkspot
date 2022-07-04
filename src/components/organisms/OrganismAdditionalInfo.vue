<template>
  <ValidationObserver ref="observer" v-slot="{}">
    <MoleculeCheckbox
      :fieldName="ADD_INFO.AMENITIES"
      :rules="validation.amenities"
      :values="checkboxData"
      @data="updateAmenitiesData"
    >
      {{ ADD_INFO.AMENITIES }}
    </MoleculeCheckbox>
    <MoleculeSelectInput
      :fieldName="ADD_INFO.SPOTS"
      :list="spotData"
      :rules="validation.spot"
      @input="updateSpot"
      :placeholder="'Please specify the no. of Spot'"
      :label="ADD_INFO.SPOTS"
    ></MoleculeSelectInput>
    <MoleculeSelectInput
      :fieldName="ADD_INFO.MINIMUM_DURATION"
      :list="minDurData"
      :rules="validation.minDur"
      @input="updateMinDur"
      :placeholder="'Minimum duration if any'"
      :label="ADD_INFO.MINIMUM_DURATION"
    ></MoleculeSelectInput>
    <MoleculeNameInput
      :fieldName="ADD_INFO.RENT"
      :placeholder="ADD_INFO.RENT"
      :rules="validation.rent"
      v-model="model.rent"
      :label="ADD_INFO.RENT"
    ></MoleculeNameInput>
  </ValidationObserver>
</template>

<script>
import { ValidationObserver } from "vee-validate";
import MoleculeCheckbox from "../molecules/MoleculeCheckbox.vue";
import MoleculeSelectInput from "../molecules/MoleculeSelectInput.vue";
import MoleculeNameInput from "../molecules/MoleculeNameInput.vue";
import { ADD_INFO } from "../../constant/constant";
import { mapMutations } from "vuex";
export default {
  name: "OrganismAdditionalInfo",
  components: {
    ValidationObserver,
    MoleculeCheckbox,
    MoleculeSelectInput,
    MoleculeNameInput,
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
      ADD_INFO,
      checkboxData: ADD_INFO.AMENITIES_DATA,
      spotData: ADD_INFO.SPOTS_DATA,
      minDurData: ADD_INFO.MINIMUM_DURATION_DATA,
      model: {
        amenities: "",
        spot: "",
        minDur: "",
        rent: "",
      },
      validation: {
        amenities: "required",
        spot: "required",
        minDur: "required",
        rent: "required",
      },
    };
  },
  watch: {
    formSubmitted(newVal) {
      console.log("organism contact form");
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
      updateAddInfo: "soportal/update-additional-info",
    }),
    submit() {
      this.updateAddInfo(this.model);
    },
    updateMinDur(data) {
      this.model.minDur = data.name;
    },
    updateSpot(data) {
      this.model.spot = data.name;
    },
    updateAmenitiesData(data) {
      this.model.amenities = data;
    },
  },
};
</script>

<style></style>
