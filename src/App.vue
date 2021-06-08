<template>
  <div id="app">
    <t-navbar />
    <router-view />
    <t-footer />
  </div>
</template>


<script>
import TNavbar from "@/components/templates/t-navbar.vue";
import TFooter from "@/components/templates/t-footer.vue";
export default {
  components: { TNavbar, TFooter },
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap");
#app {
  font-family: "Poppins", sans-serif;
}
</style>
