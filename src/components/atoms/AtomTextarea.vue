<template>
  <b-field :label="label">
    <b-input
      :maxlength="maxlength"
      type="textarea"
      :placeholder="placeholder"
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
};
</script>

<style></style>
