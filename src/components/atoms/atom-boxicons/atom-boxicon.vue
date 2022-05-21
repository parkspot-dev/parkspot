<template>
  <box-icon
    :type="types"
    :name="name"
    :color="color"
    :size="size"
    :rotate="rotate"
    :flip="flip"
    :border="border"
    :animation="animation"
    :pull="pull"
  ></box-icon>
</template>

<script>
export default {
  name: "AtomBoxicons",
  props: {
    types: {
      type: String,
      default() {
        return "regular";
      },
    },
    name: {
      type: String,
      default() {
        return "alarms";
      },
    },
    color: {
      type: String,
      default() {
        return "white";
      },
    },
    size: {
      type: String,
      default() {
        return "md";
      },
    },
    rotate: {
      type: String,
      default() {
        return "";
      },
    },
    flip: {
      type: String,
      default() {
        return "";
      },
    },
    animation: {
      type: String,
      default() {
        return "";
      },
    },
    pull: {
      type: String,
      default() {
        return "";
      },
    },
    border: {
      type: String,
      default() {
        return "";
      },
    },
  },
};
</script>
