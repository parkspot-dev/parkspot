<template>
  <section>
    <b-pagination
      :total="totals"
      v-model="data"
      :per-page="3"
      @change="onChange"
    >
      <template #previous="props">
        <b-pagination-button :page="props.page" tag="button">
          Previous
        </b-pagination-button>
      </template>

      <template #next="props">
        <b-pagination-button :page="props.page" tag="button">
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
    totals: {
      type: Number,
      default: 1,
    },
    current: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      data: 1,
    };
  },
  emits: ["changed"],
  computed: {
    currentPage() {
      return this.current;
    },
  },
  methods: {
    onChange(val) {
      this.$emit("changed", val);
    },
  },
};
</script>

<style></style>
