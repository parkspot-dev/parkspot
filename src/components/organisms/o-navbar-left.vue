<template>
  <div class="o_navbar_left">
    <router-link to="/Home">
      <atom-img id="ps_size_change" :src="src1" />
    </router-link>
    <router-link to="/Home">
      <atom-img class="ps_size_change_text" :src="src2" />
    </router-link>
  </div>
</template>

<script>
import atomImg from "@/components/atoms/atom-img/atom-img.vue";
export default {
  components: { atomImg },
  name: "o-navbar-vue",
  data() {
    return {
      src1: require("@/assets/img/pstopmini.png"),
      src2: require("@/assets/img/pstoptext.png"),
    };
  },
};
</script>

<style scoped>
/* .o_navbar_left{
    padding:0;
} */
#ps_size_change {
  width: 39px;
  min-height: 36px;
}
.ps_size_change_text {
  display: none;
}
@media only screen and (min-width: 1024px) {
  #ps_size_change {
    width: 71px;
    min-height: 64px;
  }
  .ps_size_change_text {
    display: block;
    width: 150px;
    min-height: 50px;
  }
}
</style>