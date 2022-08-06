<template>
      <component :is="level">
            <slot></slot>
      </component>
</template>

<script>
export default {
      name: "AtomHeading",
      props: {
            /**
             * The heading level used for the heading
             * @values h1, h2, h3, h4, h5, h6
             */
            level: {
                  type: String,
                  default: "h1",
                  validator: (value) => {
                        return value.match(/(h1|h2|h3|h4|h5|h6)/);
                  },
            },
      },
};
</script>

<style scoped>
h1 {
      letter-spacing: -2px;
      font-size: 3rem;
      font-weight: var(--semi-bold-font);
}
h2 {
      font-size: 2.5rem;
      font-weight: var(--semi-bold-font);
}
@media only screen and (max-width: 600px) {
      h1 {
            font-size: 2.5rem;
      }
      h2 {
            font-size: 2rem;
      }
}
h3 {
      font-size: 2rem;
      font-weight: var(--semi-bold-font);
}
h4 {
      font-size: 1.5rem;
      font-weight: var(--semi-bold-font);
}
h5 {
      font-size: 1.25rem;
      font-weight: var(--regular-font);
}
h6 {
      font-size: 1rem;
      font-weight: var(--regular-font);
}
</style>
