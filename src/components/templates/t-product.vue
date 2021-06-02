<template>
  <section class="t_products section">
    <atom-b-title class="ps_title mb-6 has-text-centered" :text="text"/>
    <div class="columns">
      <o-product-card class="column center" />
      <o-product-card class="column center " />
      <o-product-card class="column center " />
      <o-product-card class="column center" />
    </div>
  </section>
</template>

<script>
import oProductCard from "@/components/organisms/o-product-card.vue";
import AtomBTitle from '@/components/atoms/atom-text/atom-b-title.vue';
export default {
  components: { oProductCard,AtomBTitle },
  name: "t-product",
  data(){
    return{
      text:"Our Team"
    }
  }
};
</script>

<style scoped>
.ps_title{
  font-size:36px;
}
</style>