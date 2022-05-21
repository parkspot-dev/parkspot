<template>
  <h2>{{ text }}</h2>
</template>

<script>
export default {
  name: "AtomBSubtitle",
  props: {
    text: {
      type: String,
      default() {
        return "SubTitle";
      },
    },
  },
};
</script>
