<template>
    <b-image
      :alt="alt"
      :ratio="ratio"
      :src="src"
      :style="imgStyle"
      class="b-img"
      lazy
    ></b-image>
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
        default : '',
      },
      /**
       * Optional width for the image
       */
      width: {
        type: String,
        default: null,
      },
      /**
       * Optional height for the image
       */
      height: {
        type: String,
        default: null,
      },
    },
    computed: {
      imgStyle() {
        const styles = {};
        if (this.width) {
          styles.width = this.width;
        }
        if (this.height) {
          styles.height = this.height;
        }
        return styles;
      },
    },
  };
  </script>  