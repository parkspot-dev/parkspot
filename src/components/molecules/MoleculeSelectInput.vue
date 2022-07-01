<template>
  <ValidationProvider
    ref="provider"
    :rules="rules"
    :name="fieldName"
    v-slot="{ errors, valid }"
  >
    <AtomSelectInput
      :errorMessage="errors"
      :errorType="{ 'is-danger': errors[0], 'is-success': valid }"
      :list="list"
      :placeholder="placeholder"
      :label="label"
      v-model="innerValue"
      class="mb-5"
    ></AtomSelectInput>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from "vee-validate";
import AtomSelectInput from "../atoms/AtomSelectInput.vue";
export default {
  name: "MoleculeSelectInput",
  components: {
    ValidationProvider,
    AtomSelectInput,
  },
  props: {
    rules: {
      type: [Object, String],
      default: "",
    },
    list: {
      type: Array,
      default: null,
      required: true,
    },
    placeholder: {
      type: String,
    },
    fieldName: {
      type: String,
      default: "field",
    },
    label: {
      type: String,
    },
    // must be included in props
    value: {
      type: null,
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
