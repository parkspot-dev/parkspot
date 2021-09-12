<template>
  <div class="discover_page">
    <t-discover :cardData="cardData" />
  </div>
</template>

<script>
// import { db } from "@/firebase.js";
import { pageData } from "../firebase";
import tDiscover from "../components/templates/t-discover.vue";
export default {
  components: { tDiscover },
  name: "discover-page",
  data() {
    return {
      cardData: [],
    };
  },
  mounted() {
    console.log("z");
    this.getPageData();
    console.log(this.$route.params.pathMatch);
  },
  methods: {
    async getPageData() {
      const data = await pageData;
      this.cardData = [...data.marathahalli.Sites];
      console.log(data.marathahalli.Sites);
    },
  },
};
</script>
<style scoped>
</style>