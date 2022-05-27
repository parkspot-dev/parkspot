<template>
  <div v-if="show" class="m_testimony card">
    <atom-text class="ps_text" :text="comma" />
    <atom-text :text="testimony" />
    <br />
    <div class="star">
      <atom-boxicon
        v-for="i in star"
        :key="i"
        :types="boxicon.solid"
        :name="boxicon.star"
        :color="boxicon.orange"
        :size="boxicon.xsmall"
      />
    </div>
  </div>
</template>
<script>
import AtomBoxicon from "../atoms/atom-boxicons/atom-boxicon.vue";
import atomText from "../atoms/atom-text/atom-text.vue";
export default {
  name: "MTestimony",
  components: { atomText, AtomBoxicon },
  props: ["testimony", "star", "show"],
  data() {
    return {
      boxicon: {
        star: "star",
        solid: "solid",
        orange: "orange",
        xsmall: "xs",
      },
      comma: "“",
    };
  },
};
</script>

<style scoped>
.card {
  border-radius: 30px;
  padding: 80px 40px;
}
.ps_text {
  font-size: 140px;
  font-family: sans-serif;
  color: var(--primary-color);
  line-height: 0;
}
.star {
  float: right;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
