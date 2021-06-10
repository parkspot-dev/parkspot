<template>
  <input
    :value="value"
    @input="handleInput"
    @change="handleChange"
    @keypress="handleKeypress"
    :type="types"
    :placeholder="placeholder"
    :required="required"
  />
</template>

<script>
export default {
  name: "atom-input",
  props: {
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
        return "";
      },
    },
  },
  // computed: {
  //   inputListeners: function () {
  //     var vm = this;
  //     // `Object.assign` merges objects together to form a new object
  //     return Object.assign(
  //       {},
  //       // We add all the listeners from the parent
  //       this.$listeners,
  //       // Then we can add custom listeners or override the
  //       // behavior of some listeners.
  //       {
  //         // This ensures that the component works with v-model
  //         input: function (event) {
  //           vm.$emit("input", event.target.value);
  //         },
  //       }
  //     );
  //   },
  // },
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