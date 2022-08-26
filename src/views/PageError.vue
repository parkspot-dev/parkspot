<template>
  <TemplateError @homeBtn="homeBtn"></TemplateError>
</template>

<script>
import TemplateError from "../components/templates/TemplateError.vue";
export default {
  name: "PageError",
  components: {
    TemplateError,
  },
  data() {
    return {};
  },
  methods: {
    homeBtn() {
      this.$router.push({ name: "Home" });
    },
  },
};
</script>

<style></style>
