<template>
  <div class="o_product_card">
    <div class="o_product_card_inner">
      <div class="card card_front">
        <div class="card-image">
          <atom-img class="image" :src="src" />
        </div>
        <div class="card-content">
          <atom-b-subtitle
            class="is-size-6 has-text-weight-semibold"
            :text="title"
          />
        </div>
      </div>
      <div class="card card_back">
        <m-product-back :title="title" :text="text" />
      </div>
    </div>
  </div>
</template>

<script>
import atomImg from "@/components/atoms/atom-img/atom-img.vue";
import MProductBack from "@/components/molecules/m-product-back.vue";
import AtomBSubtitle from "@/components/atoms/atom-text/atom-b-subtitle.vue";
export default {
  components: { atomImg, MProductBack, AtomBSubtitle },
  name: "o-product-card",
  props: {
    title: String,
    text: String,
    src: String,
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
  border-radius: 30px;
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  box-shadow: 0 0.5em 1em -0.125em rgb(10 10 10 / 10%),
    0 0px 0 1px rgb(10 10 10 / 2%);
  animation: mymove infinite;
  animation-duration: 8s;
  animation-delay: 4s;
}

.o_product_card:hover .o_product_card_inner {
  transform: rotateY(180deg);
  animation-play-state: paused;
}

.card_front,
.card_back {
  border-radius: 30px;
  position: absolute;
  padding: 10px;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
@keyframes mymove {
  from {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(180deg);
  }
  to {
    transform: rotateY(360deg);
  }
  /* 0% {
    transform: rotateY(0deg);
  }
  25% {
    transform: rotateY(90deg);
  }
  50% {
    transform: rotateY(180deg);
  }
  75% {
    transform: rotateY(270deg);
  }
  100% {
    transform: rotateY(360deg);
  } */
}
.card_back {
  transform: rotateY(180deg);
  padding: 50px 0px;
}
.image {
  display: block;
  margin: auto;
  height: 150px;
  width: 150px;
}

.card-content {
  padding: 10px;
}
@media only screen and (min-width: 1024px) {
  .o_product_card {
    width: 350px;
    height: 450px;
  }
  .image {
    height: 350px;
    width: 250px;
  }
  .card_back {
    padding: 150px 0px;
  }
}
</style>
