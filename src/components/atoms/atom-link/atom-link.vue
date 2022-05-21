<template>
  <a :href="href">{{ text }}</a>
</template>

<script>
export default {
  name: "AtomLink",
  props: {
    href: String,
    text: String,
  },
};
</script>
