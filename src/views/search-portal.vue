<template>
  <TemplateInventory :lists="spotDetails"></TemplateInventory>
</template>
<script>
import TemplateInventory from "../components/templates/TemplateInventory.vue";
export default {
  name: "SearchPortal",
  components: {
    TemplateInventory,
  },
  data() {
    return {
      spotDetails: [],
    };
  },
  created() {
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
