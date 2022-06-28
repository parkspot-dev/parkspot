<template>
  <ValidationProvider
    ref="provider"
    :name="fieldName"
    :rules="rules"
    v-slot="{ errors }"
  >
    <AtomCheckboxs :values="values"></AtomCheckboxs>
    <span class="has-text-danger">{{ errors[0] }}</span>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from "vee-validate";
import AtomCheckboxs from "../atoms/AtomCheckboxs.vue";
export default {
  name: "MoleculeCheckBox",
  components: {
    ValidationProvider,
    AtomCheckboxs,
  },
  props: {
    rules: {
      type: [Object, String],
      default: "",
    },
    fieldName: {
      type: String,
      required: true,
    },
    values: {
      type: Array,
    },
  },
};
</script>

<style></style>
