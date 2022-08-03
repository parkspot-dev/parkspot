<template>
  <section>
    <b-pagination :total="200" v-model="current" :per-page="10">
      <template #previous="props">
        <b-pagination-button
          :page="props.page"
          tag="router-link"
          :to="`/documentation/pagination#page${props.page.number}`"
        >
          Previous
        </b-pagination-button>
      </template>

      <template #next="props">
        <b-pagination-button
          :page="props.page"
          tag="router-link"
          :to="`/documentation/pagination#page${props.page.number}`"
        >
          Next
        </b-pagination-button>
      </template>
    </b-pagination>
  </section>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    current: {
      type: Number,
      default: 1,
    },
  },
};
</script>

<style></style>
