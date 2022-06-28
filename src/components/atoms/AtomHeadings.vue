<template>
  <component :is="level">
    <slot></slot>
  </component>
</template>

<script>
export default {
  name: "AtomHeadings",
  props: {
    /**
     * The heading level used for the heading
     * @values h1, h2, h3, h4, h5, h6
     */
    level: {
      type: String,
      default: "h1",
      validator: (value) => {
        return value.match(/(h1|h2|h3|h4|h5|h6)/);
      },
    },
  },
};
</script>

<style></style>
