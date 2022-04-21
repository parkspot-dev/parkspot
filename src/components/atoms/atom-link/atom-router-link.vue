<template>
  <router-link :to="{ name: `${link}` }"> {{ text }}</router-link>
</template>

<script>
export default {
  name: "atom-router-link",
  props: {
    link: {
      type: String,
      default() {
        return "";
      },
    },
    text: {
      type: String,
      default() {
        return "";
      },
    },
  },
};
</script>
