<template>
  <div>
    <PSNavbar />
    <div class="box subtitle mt-5">
      <p>
        ParkSpot helps you to find the perfect spot in
        <span
          ><b>{{ places }}</b></span
        >
        for your Car/bike.
      </p>
      <p>Book your parking spot in few clicks</p>
      <p>
        Download our new App ParkSpot from Google Play and park your Car/Bike in
        the right spot
      </p>
      <p>
        For more information please <span v-on:click="onContact"> <a> contact us </a> </span>
      </p>
    </div>
    <PSFooter />
  </div>
</template>

<script>
import PSFooter from "@/components/PSFooter.vue";
import PSNavbar from "@/components/PSNavbar.vue";
export default {
  name: "PSTemplate",
  props: {
    places: String,
  },
  components: {
    PSFooter,
    PSNavbar,
  },
  methods:{
    onContact(){
      this.$router.push('/')
    }
  }
};
</script>

<style scoped>
p {
  letter-spacing: 3px;

  line-height: 2.7;
}
</style>