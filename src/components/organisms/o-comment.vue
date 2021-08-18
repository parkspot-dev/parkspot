<template>
  <div class="o_comment">
    <atom-b-subtitle class="is-size-4 mb-2" :text="commentTitle" />
    <atom-textarea class="textarea mb-2" />
    <atom-input class="input mb-2" />
    <atom-input class="input mb-2" />
    <atom-button class="button is-warning is-pulled-right" :text="Submit" />
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