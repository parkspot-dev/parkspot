<template>
  <ValidationProvider
    ref="provider"
    :name="fieldName"
    :rules="rules"
    v-slot="{ errors }"
  >
    <AtomUploads class="mb-5"></AtomUploads>
    <span class="has-text-danger">{{ errors[0] }}</span>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from "vee-validate";
import AtomUploads from "../atoms/AtomUploads.vue";
export default {
  name: "MoleculeUpload",
  components: { ValidationProvider, AtomUploads },
  props: {
    rules: {
      type: [Object, String],
      default: "",
    },
    fieldName: {
      type: String,
      default: "field",
    },
  },
  methods: {
    async handleChange(data) {
      const { valid } = await this.$refs.provider.validate(data);
      if (valid) {
        this.$emit("data", data.target.value);
      }
    },
  },
};
</script>

<style></style>
