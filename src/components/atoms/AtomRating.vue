<template>
  <b-rate
    v-model="rate"
    :icon-pack="pack"
    :icon="icon"
    :max="max"
    :size="size"
    :locale="locale"
    :spaced="isSpaced"
    :disabled="isDisabled"
  >
  </b-rate>
</template>
<script>
export default {
  name: "AtomRating",
  props: {
    rate: {
      type: Number,
      default: 5,
    },
    /**
     * size @value is-small, is-medium, is-large
     */
    size: {
      type: String,
      default: "is-small",
    },
  },
  data() {
    return {
      max: 5,
      pack: "mdi",
      icon: "star",
      isSpaced: false,
      isDisabled: true,
      locale: undefined, // Browser locale
    };
  },
};
</script>
