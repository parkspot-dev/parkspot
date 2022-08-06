<template>
      <TemplateThankYou @homeBtn="homeBtn"></TemplateThankYou>
</template>

<script>
import TemplateThankYou from "../components/templates/TemplateThankYou.vue";
export default {
      name: "PageThankYou",
      components: {
            TemplateThankYou,
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
