<template>
  <div>
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
        Download our new App <span><a href="https://play.google.com/store/apps/details?id=com.parkspot.maya_nagri&utm_source=parkspot.in&utm_campaign=website">ParkSpot</a></span> ParkSpot from Google Play and park your Car/Bike in
        the right spot
      </p>
      <p>
        For more information please <span v-on:click="onContact"> <a> contact us </a> </span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "PSTemplate",
  props: {
    places: String,
  },
  components: {
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