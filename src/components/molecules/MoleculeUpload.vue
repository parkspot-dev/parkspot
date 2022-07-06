<template>
  <ValidationProvider
    ref="provider"
    :name="fieldName"
    :rules="rules"
    v-slot="{ errors }"
  >
    <AtomUploads @uploadFiles="handleUpload" class="mb-5"></AtomUploads>
    <span class="has-text-danger">{{ errors[0] }}</span>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from "vee-validate";
import AtomUploads from "../atoms/AtomUploads.vue";
import { getConvertedImage } from "../../inlcudes/ConvertImageToByte";
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
    async handleUpload(data) {
      const { valid } = await this.$refs.provider.validate(data);
      if (valid) {
        const imgArray = await getConvertedImage(data[0]);
        this.$emit("data", imgArray);
      }
    },
  },
};
</script>

<style></style>
