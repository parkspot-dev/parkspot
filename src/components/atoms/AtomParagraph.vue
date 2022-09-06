<template>
  <component :is="type" :class="['paragraph', variation]">
    <slot></slot>
  </component>
</template>

<script>
export default {
  name: 'AtomParagraph',
  props: {
    /**
     * The html element used for the text.
     * @values p, span
     */
    type: {
      type: String,
      default: 'p',
      validator: (value) => {
        return value.match(/(p|span)/);
      },
    },
    /**
     * Style variation to give additional meaning.
     * @values intro, small, medium, large
     */
    variation: {
      type: String,
      default: 'medium',
      validator: (value) => {
        return value.match(/(medium|intro|large|small)/);
      },
    },
  },
};
</script>

<style scoped>
.paragraph {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: var(--regular-font);
  line-height: var(--lh-para);
  transition: color 0.3s ease;
}

.paragraph a {
  text-decoration: none;
}

.paragraph a:hover {
  color: var(--secondary-color);
}

.paragraph.intro {
  font-size: 2.5rem;
  font-weight: var(--semi-bold-font);
  line-height: var(--lh-small);
}

.paragraph.large {
  font-size: 1.5rem;
  font-weight: var(--semi-bold-font);
}

.paragraph.small {
  font-size: 0.75rem;
}
</style>
