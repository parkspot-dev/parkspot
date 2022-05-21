<template>
  <div>
    <br />
    <o-request-card
      v-for="spot in spotDetails"
      :key="spot.ID"
      :request="spot"
    />
  </div>
</template>

<script>
import ORequestCard from "@/components/organisms/o-request-card.vue";
export default {
  name: "TSearchTable",
  components: {
    ORequestCard,
  },
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
