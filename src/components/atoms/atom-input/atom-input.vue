<template>
  <input
    class="input input_rounded"
    :value="value"
    :type="types"
    :placeholder="placeholder"
    :required="required"
    :pattern="pattern"
    :title="title"
    @invalid="handleInvalid"
    @input="handleInput"
    @change="handleChange"
    @keypress="handleKeypress"
  />
</template>

<script>
export default {
  name: "AtomInput",
  emits: ["input", "change", "keypress", "invalid"],
  props: {
    validationCheck: {
      type: String,
      default() {
        return "";
      },
      requried: false,
    },
    title: {
      type: String,
      default() {
        return null;
      },
    },
    pattern: {
      type: String,
      default() {
        return null;
      },
    },
    value: String,
    required: {
      type: Boolean,
      default() {
        return false;
      },
    },
    types: {
      type: String,
      default() {
        return "text";
      },
    },
    placeholder: {
      type: String,
      default() {
        return "Default Input";
      },
      required: true,
    },
  },
  methods: {
    handleInput(event) {
      this.$emit("input", event.target.value);
    },
    handleChange(value) {
      this.$emit("change", value);
    },
    handleKeypress(value) {
      this.$emit("keypress", value);
    },
    handleInvalid(event) {
      this.$emit("invalid", event, this.validationCheck);
    },
  },
};
</script>

<style scoped>
.input_rounded {
  border-radius: 15px;
  padding: 20px 16px;
  font-weight: 600;
  letter-spacing: 0.01em;
  font-size: 14px;
  height: 3.5em;
}
</style>
