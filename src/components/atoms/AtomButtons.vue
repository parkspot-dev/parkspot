<template>
  <b-button :type="type"><slot></slot></b-button>
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
  },
};
</script>

<style></style>
