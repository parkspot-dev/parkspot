<template>
  <b-button
    @click="onClick"
    :icon-left="left"
    :type="type"
    :icon-right="right"
    :outlined="outlined"
    :inverted="inverted"
  >
    <slot></slot>
  </b-button>
</template>

<script>
export default {
  name: "AtomButton",
  props: {
    /**
     * Type of Button
     * @values is-warning, is-danger
     */
    type: {
      type: String,
      default: "is-warning",
    },
    /**
     * icons for the button
     * Material Design icons are used
     * for more icon details https://materialdesignicons.com/
     */
    left: {
      type: String,
    },
    right: {
      type: String,
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    inverted: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["btnClick"],
  methods: {
    onClick() {
      this.$emit("btnClick");
    },
  },
};
</script>

<style></style>
