<template>
  <div class="columns">
    <div class="column">
      <label class="label"><slot></slot></label>
    </div>
    <div class="column">
      <ValidationProvider
        ref="provider"
        :name="fieldName"
        :rules="rules"
        v-slot="{ errors }"
      >
        <AtomRadioButtons
          @change.native="handleChange"
          :values="values"
        ></AtomRadioButtons>
        <span>{{ errors[0] }}</span>
      </ValidationProvider>
    </div>
  </div>
</template>

<script>
import { ValidationProvider } from "vee-validate";
import AtomRadioButtons from "../atoms/AtomRadioButtons.vue";
export default {
  name: "MoleculeRadioButton",
  components: { ValidationProvider, AtomRadioButtons },
  props: {
    values: {
      type: Array,
      required: true,
    },
    rules: {
      type: [Object, String],
      default: "",
    },
    fieldName: {
      type: String,
      default: "field",
    },
  },
  emits: ["data"],
  //   data() {
  //     return {
  //       list: ["Yes", "No"],
  //     };
  //   },
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
