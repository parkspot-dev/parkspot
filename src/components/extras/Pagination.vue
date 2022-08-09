<template>
      <section>
            <b-pagination
                  :total="totals"
                  v-model="data"
                  :size="'is-small'"
                  :per-page="3"
                  :range-before="2"
                  :range-after="2"
                  :order="'is-centered'"
                  @change="onChange"
            >
                  <template #previous="props">
                        <b-pagination-button
                              :page="props.page"
                              tag="button"
                              class="pagination-btn"
                        >
                              Previous
                        </b-pagination-button>
                  </template>

                  <template #next="props">
                        <b-pagination-button
                              :page="props.page"
                              tag="button"
                              class="pagination-btn"
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

<style >
.pagination-link.is-current {
      background-color: var(--secondary-color) !important;
}
.pagination-btn {
      background-color: var(--primary-color);
      cursor: pointer;
}
</style>
