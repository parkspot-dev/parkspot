<template>
<section class="t_map hero ">
  <div class="hero-body">
    <m-search-box class="ps_search" />
    <div class="ps_map"></div>
  </div>
</section>
  
</template>

<script>
import mSearchBox from "@/components/molecules/m-search-box.vue";
import AtomImg from "@/components/atoms/atom-img/atom-img.vue";
export default {
  components: { mSearchBox, AtomImg },
  name: "t-map",
  data() {
    return {
    };
  },
};
</script>

<style scoped>
.t_map{
  top: 0;
  position:relative;
}
.hero-body {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  height: 60vh;
  width: 100%;
}
.ps_map {
  background-image: url("../../assets/img/mobile-home-map.svg");
  position: absolute;
  top: 0;
  left: 0;
  min-height: 60vh;
  min-width: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  z-index: -1;
}

.ps_search {
  width: 60%;
  z-index: 1;
}

@media only screen and (min-width: 1024px) {
  .t_map {
    height: 80vh;
  }
  .ps_map {
    background-image: url("../../assets/img/home-map.svg");
    min-height: 70vh;
  }
}
</style>