<template>
  <div class="o_comment">
    <form v-on:submit.prevent="postComment">
      <atom-b-subtitle class="is-size-4 mb-2" :text="commentTitle" />
      <atom-text class="is-size-7 mx-2" :text="comment" />
      <atom-textarea v-model="commentDetails.comment" class="textarea mb-2" />
      <atom-text class="is-size-7 mx-2" :text="name" />
      <atom-input v-model="commentDetails.name" class="input mb-2" />
      <atom-text class="is-size-7 mx-2" :text="email" />
      <atom-input v-model="commentDetails.email" class="input mb-2" />
      <atom-button
        class="button is-warning is-pulled-right"
        :class="{ 'is-loading': toggle }"
        :text="Submit"
      />
    </form>
  </div>
</template>
<script>
import AtomButton from "../atoms/atom-button/atom-button.vue";
import AtomInput from "../atoms/atom-input/atom-input.vue";
import AtomTextarea from "../atoms/atom-input/atom-textarea.vue";
import atomBSubtitle from "../atoms/atom-text/atom-b-subtitle.vue";
import AtomText from "../atoms/atom-text/atom-text.vue";
export default {
  components: { atomBSubtitle, AtomTextarea, AtomInput, AtomButton, AtomText },
  name: "o-comment",
  data() {
    return {
      commentTitle: "Leave A Comment",
      Submit: "Submit",
      comment: "Comment",
      name: "Name",
      email: "Email (optional)",
      toggle: false,
      commentDetails: {
        comment: "",
        name: "",
        email: "",
      },
    };
  },
  methods: {
    async postComment() {
      this.toggle = !this.toggle;
      const res = await fetch("https://maya.parkspot.in/contact", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          User: {
            FullName: this.commentDetails.name,
            EmailID: this.commentDetails.email,
            Mobile: "",
          },
          Comments: this.commentDetails.comment,
        }),
      });
      this.commentDetails.name = "";
      this.commentDetails.email = "";
      this.commentDetails.comment = "";
      this.toggle = !this.toggle;
    },
  },
};
</script>