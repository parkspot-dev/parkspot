<template>
  <button :disabled="disabled">{{ text }}</button>
</template>

<script>
export default {
  name: "atom-button",
  props: {
    disabled: {
      type: Boolean,
      default() {
        return false;
      },
    },
    text: {
      type: String,
      default() {
        return "Button";
      },
    },
  },
};
</script>