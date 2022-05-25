<template>
  <div>
    <atom-text class="title is-size-7" :text="title" />

    <atom-text class="is-size-6" :text="text" />
  </div>
</template>

<script>
import AtomText from "@/components/atoms/atom-text/atom-text.vue";
export default {
  name: "MTextTitle",
  components: {
    AtomText,
  },
  props: {
    title: String,
    text: String,
  },
};
</script>

<style scoped>
.title {
  margin: 5px;
  margin-bottom: 0px;
}
</style>
>
