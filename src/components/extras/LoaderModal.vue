<template>
      <b-loading
            :is-full-page="isFullPage"
            v-model="isLoading"
            :can-cancel="true"
      ></b-loading>
</template>

<script>
export default {
      name: "LoaderModal",
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
