<template>
  <div class="o_product_card">
    <div class="o_product_card_inner">
      <div class="card card_front">
        <div class="card-image">
          <atom-img class="image" :src="src" />
        </div>
      </div>
      <div class="card card_back">
          <m-product-back class="card-content" />
      </div>
    </div>
  </div>
</template>

<script>
import atomImg from "@/components/atoms/atom-img/atom-img.vue";
import MProductBack from "@/components/molecules/m-product-back.vue";
export default {
  components: { atomImg, MProductBack },
  name: "o-product-card",
  data() {
    return {
      src: require("@/assets/img/mall.svg"),
    };
  },
};
</script>

<style scoped>
.o_product_card {
  background-color: transparent;
  width: 250px;
  height: 250px;
  perspective: 1000px;
}

.o_product_card_inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
}

.o_product_card:hover .o_product_card_inner {
  transform: rotateY(180deg);
}

.card_front, .card_back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
.card_back {
  transform: rotateY(180deg);
}
.card-content{
  padding: 15px;
}
</style>