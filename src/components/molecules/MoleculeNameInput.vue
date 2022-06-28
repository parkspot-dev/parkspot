<template>
  <ValidationProvider
    :name="fieldName"
    :rules="rules"
    v-slot="{ errors, valid }"
  >
    <AtomInputs
      v-model="innerValue"
      :placeholder="placeholder"
      :type="inputType"
      :labelMessage="errors"
      :labelType="{ 'is-danger': errors[0], 'is-success': valid }"
    >
    </AtomInputs>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from "vee-validate";
import AtomInputs from "../atoms/AtomInputs.vue";
export default {
  name: "MoleculeNameInput",
  components: {
    ValidationProvider,
    AtomInputs,
  },
  props: {
    value: {
      type: null,
      required: true,
    },
    placeholder: {
      type: String,
      required: true,
    },
    rules: {
      type: [Object, String],
      default: "",
    },
    inputType: {
      type: String,
    },
    /**
     * Name of the input field required
     * to display correct error message
     */
    fieldName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      innerValue: "",
    };
  },
  watch: {
    // Handles internal model changes.
    innerValue(newVal) {
      this.$emit("input", newVal);
    },
    // Handles external model changes.
    value(newVal) {
      this.innerValue = newVal;
    },
  },
  created() {
    if (this.value) {
      this.innerValue = this.value;
    }
  },
};
</script>

<style></style>
