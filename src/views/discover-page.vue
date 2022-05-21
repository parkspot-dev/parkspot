<template>
  <div class="discover_page">
    <t-discover
      :card-data="cardData"
      :searched-text="searchedText"
      :show="show"
    />
  </div>
</template>

<script>
// import { db } from "@/firebase.js";
import { firebase, getDatabase, ref, get, child } from "../firebase";
import tDiscover from "../components/templates/t-discover.vue";
export default {
  name: "DiscoverPage",
  components: { tDiscover },
  data() {
    return {
      cardData: [],
      searchedText: "",
      show: false,
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
            return snapshot.val();
          } else {
            console.log("No data available");
            this.show = !this.show;
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
<style scoped></style>
