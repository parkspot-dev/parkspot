<template>
  <div class="o_comment">
    <atom-b-subtitle :text="commentTitle" />
    <atom-textarea class="textarea" />
    <atom-input class="input" />
    <atom-input class="input" />
    <atom-button class="button" :text="Submit" />
  </div>
</template>
<script>
import AtomButton from "../atoms/atom-button/atom-button.vue";
import AtomInput from "../atoms/atom-input/atom-input.vue";
import AtomTextarea from "../atoms/atom-input/atom-textarea.vue";
import atomBSubtitle from "../atoms/atom-text/atom-b-subtitle.vue";
export default {
  components: { atomBSubtitle, AtomTextarea, AtomInput, AtomButton },
  name: "o-comment",
  data() {
    return {
      commentTitle: "Leave A Comment",
      Submit: "Submit",
    };
  },
};
</script>