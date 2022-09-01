<template>
  <section>
    <b-pagination
      :total="total"
      v-model="data"
      :size="'is-small'"
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
    total: {
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
