<template>
  <section class="t_products section">
    <div class="container">
      <atom-b-title class="is-size-3-mobile is-size-2 ps_mb has-text-centered" :text="title" />
      <div class="columns">
        <o-product-card :key='product.id' v-for="product in products" class="column center" :title="product.title" :text="product.text" :src="product.src" />
      </div>
    </div>
  </section>
</template>

<script>
import oProductCard from "@/components/organisms/o-product-card.vue";
import AtomBTitle from "@/components/atoms/atom-text/atom-b-title.vue";
export default {
  components: { oProductCard, AtomBTitle },
  name: "t-product",
  data() {
    return {
      title: "Our Products",
      products:[
        {
          id:1,
          title:"ParkSpot for Malls/ Hotels",
          text:"Digitized parking space for better monetization and a seamless customer experience.",
          src:require("@/assets/img/product-mall.svg"),
        },
        {
          id:2,
          title:"ParkSpot for Corporates",
          text:"Give your employees the gift of easy parking.",
          src:require("@/assets/img/product-corporate.svg"),
        },
        {
          id:3,
          title:"ParkSpot for Societies",
          text:"Secure your society and enable seamless entry/exit for residents.",
          src:require("@/assets/img/product-society.svg"),
        },
        {
          id:4,
          title:"ParkSpot for Parking Owners",
          text:"Want to monetize your idle parking spaces?",
          src:require("@/assets/img/product-owner.svg"),
        },
      ]
    };
  },
};
</script>

<style scoped>

.ps_mb{
  margin-bottom: 50px;
}
@media only screen and (min-width: 1024px) {
.ps_mb{
  margin-bottom: 60px;
}
}
</style>