<template>
  <ValidationProvider
    ref="provider"
    :name="fieldName"
    :rules="rules"
    v-slot="{ errors }"
  >
    <label class="label"><slot></slot></label>
    <AtomCheckboxs
      @change.native="handleChange"
      :values="values"
      class="mb-5"
    ></AtomCheckboxs>
    <span class="has-text-danger is-size-7">{{ errors[0] }}</span>
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
  emits: ["data"],
  data() {
    return {
      checkboxData: [],
    };
  },
  methods: {
    async handleChange(data) {
      const { valid } = await this.$refs.provider.validate(data);
      if (valid) {
        this.checkboxData.push(data.target.value);
        this.$emit("data", this.checkboxData);
      }
    },
  },
};
</script>

<style></style>
