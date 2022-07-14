<template>
  <b-image :src="src" :alt="alt" :ratio="ratio" lazy></b-image>
</template>

<script>
export default {
  name: "AtomImage",
  props: {
    /**
     * path of the image
     */
    src: {
      type: String,
      required: true,
    },
    /**
     * image name
     */
    alt: {
      type: String,
      required: true,
    },
    /**
     * The space will be reserved.
     * Prevent page jump when images are loading when using responsive
     */
    ratio: {
      type: String,
      required: true,
    },
  },
};
</script>

<style></style>
