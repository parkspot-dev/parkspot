<template>
  <div class="section">
    <div class="container">
      <o-search-table />
    </div>
  </div>
</template>
<script>
import oSearchTable from "../organisms/o-search-table.vue";
export default {
  components: { oSearchTable },
  name: "t-search-table",
};
</script>