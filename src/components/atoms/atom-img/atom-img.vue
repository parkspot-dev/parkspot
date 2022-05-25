<template>
  <img :src="src" :alt="alt" />
</template>

<script>
export default {
  name: "AtomImg",
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
        return "parkspot.png";
      },
    },
  },
};
</script>
