<template>
  <div class="srp-container">
    <div class="srp-lists">
      <Pagination :total="total" @changed="onPageChange"></Pagination>
      <MoleculeSRPCard
        v-for="spot in spots"
        :key="spot.ID"
        :spot="spot"
        @booked="onBook"
      ></MoleculeSRPCard>
    </div>
    <div class="srp-map">
      <MapContainer
        class="mapContainer"
        :spotsList="spots"
        :key="reRender"
      ></MapContainer>
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
    total: {
      type: Number,
    },
    reRender: {
      type: Number,
    },
  },
  emits: ["changed"],
  methods: {
    onPageChange(page) {
      this.$emit("changed", page);
    },
    onBook() {
      this.$router.push({ name: "contactUs" });
    },
  },
};
</script>

<style scoped>
.srp-container {
  display: flex;
  padding-left: 3rem;
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
  height: 130vh;
  position: relative;
}
.mapSearch {
  position: absolute;
  top: 20%;
  left: 50%;
  width: 500px;
}
@media only screen and (max-width: 1024px) {
  .srp-container {
    flex-direction: column-reverse;
    padding-left: 0;
  }
  .srp-lists {
    padding: 2rem 8rem;
  }
  .mapContainer {
    height: 50vh;
  }
  .mapSearch {
    left: 5%;
    top: 10%;
    width: 50vw;
  }
}
@media only screen and (max-width: 700px) {
  .srp-lists {
    padding: 2rem 4rem;
  }
}
@media only screen and (max-width: 500px) {
  .srp-lists {
    padding: 2rem 1rem;
  }
}
</style>
