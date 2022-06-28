<template>
  <ValidationProvider ref="provider" :rules="rules" v-slot="{}">
    <AtomSelectInput></AtomSelectInput>
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
  },
};
</script>

<style></style>
