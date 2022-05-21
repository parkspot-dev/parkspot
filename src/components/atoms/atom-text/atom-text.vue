<template>
  <p>{{ textLeft }}{{ text }}{{ textRight }}</p>
</template>

<script>
export default {
  name: "AtomText",
  props: {
    text: {
      type: [String, Number],
      required: false,
    },
    textLeft: {
      type: String,
      required: false,
    },
    textRight: {
      type: String,
      required: false,
    },
  },
};
</script>
