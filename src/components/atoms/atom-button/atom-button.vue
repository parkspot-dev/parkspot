<template>
  <button class="button btn-shadow is-rounded is-warning" :disabled="disabled">
    {{ text }}
  </button>
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

<style scoped>
.btn-shadow {
  box-shadow: 0 4px 30px -10px;
}
</style>
