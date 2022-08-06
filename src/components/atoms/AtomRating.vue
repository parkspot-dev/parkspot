<template>
      <b-rate
            v-model="rate"
            :icon-pack="packs"
            :icon="icons"
            :max="maxs"
            :size="sizes"
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
             * sizes @value is-small, is-medium, is-large
             */
            sizes: {
                  type: String,
                  default: "is-small",
            },
      },
      data() {
            return {
                  maxs: 5,
                  packs: "mdi",
                  icons: "star",
                  isSpaced: false,
                  isDisabled: true,
                  locale: undefined, // Browser locale
            };
      },
};
</script>
