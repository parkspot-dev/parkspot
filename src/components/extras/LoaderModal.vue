<template>
  <b-loading
    :is-full-page="isFullPage"
    :active="isLoading"
    :can-cancel="false"
  ></b-loading>
</template>

<script>
export default {
  name: 'LoaderModal',
  /**
   * show loading animation
   */
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isFullPage: true,
    };
  },
};
</script>

<style></style>
