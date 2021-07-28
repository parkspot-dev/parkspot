<template>
  <img :src="src" :alt="alt" />
</template>

<script>
export default {
  name: "atom-img",
  props: {
    src: {
      type: String,
      default() {
        return "";
      },
    },
    alt: {
      type: String,
      default() {
        return "image.png";
      },
    },
  },
};
</script>