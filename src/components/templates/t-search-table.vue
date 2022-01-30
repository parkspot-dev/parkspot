<template>
  <div id="requestCards">
     <br />
    <o-request-card
      :key="spot.ID"
      v-for="spot in spotDetails"
      :request="spot"
    />
  </div>
</template>

<script>
import ORequestCard from "@/components/organisms/o-request-card.vue";
export default {
  components: {
    ORequestCard,
  },
  name: "t-search-table",
  data() {
    return {
      spotDetails: [],
    };
  },
  mounted() {
    this.getSpotDetails();
  },
  methods: {
    async getSpotDetails() {
      const res = await fetch(
        "https://maya.parkspot.in/internal/parking-requests"
      );
      const data = await res.json();
      this.spotDetails = data;
    },
  
  },
};
</script>
