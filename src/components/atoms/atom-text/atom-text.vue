<template>
  <p>{{ textLeft }}{{ text }}{{ textRight }}</p>
</template>

<script>
export default {
  name: "atom-text",
  props: {
    text: {
      type: String,
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
