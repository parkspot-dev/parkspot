<template>
  <div class="custom-card">
    <AtomHeadings :level="'h4'" class="mb-3">
      {{ featureHeading }}
    </AtomHeadings>
    <AtomParagraph :variation="'small'">
      <slot></slot>
    </AtomParagraph>
  </div>
</template>

<script>
import AtomHeadings from "../atoms/AtomHeadings.vue";
import AtomParagraph from "../atoms/AtomParagraph.vue";
export default {
  name: "MoleculeFeatureCard",
  components: {
    AtomHeadings,
    AtomParagraph,
  },
  props: {
    featureHeading: {
      type: String,
    },
  },
};
</script>

<style scoped>
.custom-card {
  padding: 2rem 3rem;
  border: 1px dotted black;
  border-radius: var(--border-default);
  transition: transform 0.3s ease;
}
.custom-card:hover,
.custom-card:focus {
  background-color: var(--primary-color);
  transform: scale(1.05);
  border: 1px solid transparent;
  color: var(--secondary-color);
}
</style>
