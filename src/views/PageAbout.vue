<template>
  <div class="bg-wrap">
    <TemplateAbout></TemplateAbout>
  </div>
</template>

<script>
import TemplateAbout from '../components/templates/TemplateAbout.vue';
export default {
  name: 'PageAbout',
  components: {
    TemplateAbout,
  },
};
</script>

<style scoped>
.bg-wrap {
  background-color: var(--bg-color-secondary);
}
</style>
