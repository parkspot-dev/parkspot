<template>
  <b-field :label="label">
    <b-input
      :maxlength="maxlength"
      type="textarea"
      :placeholder="placeholder"
      @input.native="onInput($event.target.value)"
    ></b-input>
  </b-field>
</template>

<script>
export default {
  name: "AtomTextarea",
  props: {
    /**
     * Textarea used for long input
     */
    label: {
      type: String,
      default: "Message",
    },
    maxlength: {
      type: Number,
      default: 200,
    },
    placeholder: {
      type: String,
      default: "Message",
    },
  },
  emits: ["input"],
  methods: {
    onInput(value) {
      this.$emit("input", value);
    },
  },
};
</script>

<style></style>
