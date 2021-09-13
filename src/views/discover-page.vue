<template>
  <div class="discover_page">
    <t-discover :cardData="cardData" :searchedText="searchedText" />
  </div>
</template>

<script>
// import { db } from "@/firebase.js";
import { firebase, getDatabase, ref, get, child } from "../firebase";
import tDiscover from "../components/templates/t-discover.vue";
export default {
  components: { tDiscover },
  name: "discover-page",
  data() {
    return {
      cardData: [],
      searchedText: "",
    };
  },
  mounted() {
    this.getPageData();
    this.searchedText = this.$route.params.pathMatch;
  },
  methods: {
    async getPageData() {
      const db = getDatabase(firebase);
      const dbref = ref(db);
      // console.log(check)
      // seo-pages database
      const pageData = await get(
        child(dbref, `seo-pages/${this.$route.params.pathMatch}`)
      )
        .then((snapshot) => {
          if (snapshot.exists()) {
            // console.log(snapshot.val());
            return snapshot.val();
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
      this.cardData = [...pageData.Sites];
      console.log(pageData);
    },
  },
};
</script>
<style scoped>
</style>