<template>
  <div class="t_srp">
    <o-srp @on-book="onBook" />
  </div>
</template>

<script>
import oSrp from "../organisms/o-srp.vue";
export default {
  name: "TSrp",
  components: { oSrp },
  methods: {
    onBook(index) {
      this.$emit("on-book", index);
    },
  },
};
</script>
<style scoped></style>
