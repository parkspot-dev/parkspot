<template>
  <textarea
    class="textarea textarea_rounded"
    :value="value"
    :cols="columns"
    :rows="rows"
    :placeholder="placeholder"
    :disabled="disabled"
    @input="handleInput"
    @change="handleChange"
    @keypress="handleKeypress"
  ></textarea>
</template>

<script>
export default {
  name: "AtomTextarea",
  props: {
    value: String,
    disabled: {
      type: Boolean,
      default() {
        return false;
      },
    },
    placeholder: {
      type: String,
      default() {
        return "";
      },
    },
    rows: {
      type: Number,
      default() {
        return 5;
      },
    },
    columns: {
      type: Number,
      default() {
        return 30;
      },
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
  },
};
</script>

<style scoped>
.textarea_rounded {
  border-radius: 15px;
  padding: 20px 16px;
  font-weight: 600;
  letter-spacing: 0.01em;
  font-size: 14px;
}
</style>
