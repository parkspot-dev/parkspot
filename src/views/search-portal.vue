<template>
  <div class="search_portal">
    <t-search-table />
  </div>
</template>
<script>
import oSearchTable from "../components/organisms/o-search-table.vue";
import TSearchTable from "../components/templates/t-search-table.vue";
export default {
  title: "Search Portal",
  components: { oSearchTable, TSearchTable },
  name: "search-portal",
};
</script>