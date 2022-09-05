<template>
  <div class="card p-6 features-card">
    <img class="features-img" :src="src" />
    <h2 class="features-title">{{ featuresTitle }}</h2>
    <p
      class="features-text"
      :class="check ? 'features-text-set' : 'features-text-unset'"
      @click="checkMethod"
    >
      <slot></slot>
    </p>
  </div>
</template>

<script>
export default {
  name: 'MoleculeFeatureBody',
  components: {},
  props: {
    featuresTitle: String,
  },
  data() {
    return {
      src: require('../../assets/features-tick.svg'),
      check: true,
    };
  },
  methods: {
    checkMethod() {
      this.check = !this.check;
    },
  },
};
</script>

<style scoped>
.features-card {
  max-height: fit-content;
}

.features-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.features-img {
  max-width: 2.5rem;
}

.features-text {
  -webkit-box-orient: vertical;
  display: -webkit-box;
  overflow: hidden;
}
.features-text-set {
  -webkit-line-clamp: 6;
}
.features-text-unset {
  -webkit-line-clamp: unset;
}
</style>
