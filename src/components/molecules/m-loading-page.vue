<template>
  <div>
    <vue-simple-spinner
      style="
        margin: 0px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      "
      size="large"
      line-bg-color="#0085AD"
      line-fg-color="#ffdd57"
      message="Loading..."
    />
  </div>
</template>
<script>
import VueSimpleSpinner from "vue-simple-spinner";
export default {
  name: "MLoadingPage",
  components: {
    VueSimpleSpinner,
  },
};
</script>
