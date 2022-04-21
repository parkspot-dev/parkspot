<template>
  <a :href="href">{{ text }}</a>
</template>

<script>
export default {
  name: "atom-link",
  props: {
    href: String,
    text: String,
  },
};
</script>
