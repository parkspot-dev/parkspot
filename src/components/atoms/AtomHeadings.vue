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

<style scoped>
h1 {
  letter-spacing: -2px;
  font-size: 3rem;
  font-weight: semi-bold;
}
h2 {
  /* letter-spacing: $spacing-xs; */
  font-size: 2.5rem;
  /* font-weight: $weight-semi-bold; */
}
h3 {
  /* letter-spacing: $spacing-xs; */
  font-size: 2rem;
  /* font-weight: $weight-semi-bold; */
}
h4 {
  /* letter-spacing: $spacing-xs; */
  font-size: 1.5rem;
  /* font-weight: $weight-semi-bold; */
}
h5 {
  /* letter-spacing: $spacing-xs; */
  font-size: 1.25rem;
  /* font-weight: $weight-semi-bold; */
}
h6 {
  /* letter-spacing: $spacing-xs; */
  font-size: 1rem;
  /* font-weight: $weight-semi-bold; */
}
</style>
