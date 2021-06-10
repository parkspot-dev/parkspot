<template>
  <textarea
    :value="value"
    @input="handleInput"
    @change="handleChange"
    @keypress="handleKeypress"
    cols="30"
    rows="5"
    :placeholder="placeholder"
  ></textarea>
</template>

<script>
export default {
  name: "atom-textarea",
  props: {
    value:String,
    placeholder: {
      type: String,
      default() {
        return "";
      },
    },
  },
  methods:{
    handleInput(event) {
      this.$emit("input", event.target.value);
    },
    handleChange(value) {
      this.$emit("change", value);
    },
    handleKeypress(value) {
      this.$emit("keypress", value);
    },
  }
};
</script>