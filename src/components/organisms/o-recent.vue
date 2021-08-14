<template>
  <div class="o_recent">
    <atom-b-subtitle :text="recent" />
    <m-blog-box-details />
  </div>
</template>

<script>
import AtomBSubtitle from "../atoms/atom-text/atom-b-subtitle.vue";
import MBlogBoxDetails from "../molecules/m-blog-box-details.vue";
export default {
  components: { AtomBSubtitle, MBlogBoxDetails },
  name: "o-recent",
};
</script>
    