<template>
  <div class="srp-container">
    <div class="srp-lists">
      <Pagination></Pagination>
      <MoleculeSRPCard
        v-for="spot in spots"
        :key="spot.ID"
        :spot="spot"
      ></MoleculeSRPCard>
    </div>
    <div class="srp-map">
      <MapContainer class="mapContainer"></MapContainer>
      <SearchInput class="mapSearch"></SearchInput>
    </div>
  </div>
</template>

<script>
import Pagination from "../extras/Pagination.vue";
import MoleculeSRPCard from "../molecules/MoleculeSRPCard.vue";
import MapContainer from "../extras/MapContainer.vue";
import SearchInput from "../extras/SearchInput.vue";
export default {
  name: "TemplateSrp",
  components: {
    Pagination,
    MoleculeSRPCard,
    MapContainer,
    SearchInput,
  },
  props: {
    spots: {
      type: Array,
    },
  },
};
</script>

<style scoped>
.srp-container {
  display: flex;
  padding-top: 2rem;
  padding-left: 3rem;
  padding-bottom: 3rem;
  gap: 2rem;
}
.srp-lists {
  flex: 20%;
  padding-top: 2rem;
}
.srp-map {
  flex: 60%;
}
.mapContainer {
  height: 100vh;
  position: relative;
}
.mapSearch {
  position: absolute;
  top: 20%;
  left: 50%;
  width: 500px;
}
</style>
