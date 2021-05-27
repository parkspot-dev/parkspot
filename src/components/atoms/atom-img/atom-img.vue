<template>
  <img :src="src" :alt="alt" :width="width" :height="height"/>
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
    width: {
      type: Number,
      default() {
        return 71;
      },
    },
    height: {
      type: Number ,
      default() {
        return 64;
      },
    },
  },
};
</script>