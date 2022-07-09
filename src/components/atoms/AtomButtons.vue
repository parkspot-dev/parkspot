<template>
  <b-button @click="onClick" :icon-left="left" :type="type" :icon-right="right"
    ><slot></slot
  ></b-button>
</template>

<script>
export default {
  name: "AtomButtons",
  props: {
    /**
     * Type of Button
     * @values is-warning, is-danger
     */
    type: {
      type: String,
      default: "is-warning",
      validator: (value) => {
        return value.match(/(is-danger)/);
      },
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
