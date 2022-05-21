<template>
  <button
    class="button btn-shadow is-rounded is-warning"
    :disabled="disabled"
    :type="type"
  >
    {{ text }}
  </button>
</template>

<script>
export default {
  name: "AtomButton",
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
    type: {
      type: String,
      default() {
        return "submit";
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
