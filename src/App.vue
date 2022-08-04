<template>
  <div id="app">
    <Navbar></Navbar>
    <main class="body-container">
      <router-view :key="$route.fullPath" />
    </main>
    <!-- :key="$route.fullPath" temporary fix ,as its only problem with this method is that every path in that router will update in the case of a path change. You may not want all that needless re-rendering, but that’s a decision for you to make.  -->
    <!-- <t-footer /> -->
    <TemplateFooter></TemplateFooter>
  </div>
</template>

<script>
// import TFooter from "@/components/templates/t-footer.vue";
import TemplateFooter from "./components/templates/TemplateFooter.vue";
import Navbar from "./components/extras/Navbar.vue";
export default {
  components: {
    // TFooter,
    TemplateFooter,
    Navbar,
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Poppins:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Rubik:wght@400;500;600;700&display=swap");
@import "./assets/styles/variables.css";
#app {
  font-family: "Poppins", sans-serif;
  color: #555;
  font-weight: 400;
}
.body-container {
  margin-top: 35px;
}
@media only screen and (max-width: 1024px) {
  .body-container {
    margin-top: 2px;
  }
}
</style>
