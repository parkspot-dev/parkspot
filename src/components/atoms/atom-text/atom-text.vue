<template>
  <p>{{ textLeft }}{{ text }}{{ textRight }}</p>
</template>

<script>
export default {
  name: "atom-text",
  props: ["text", "textLeft", "textRight"],
};
</script>