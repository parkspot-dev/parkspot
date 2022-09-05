<template>
  <div class="srp-container">
    <div class="srp-lists">
      <PaginationBody :totals="totals" @changed="onPageChange"></PaginationBody>
      <MoleculeSRPCard
        v-for="spot in spots"
        :key="spot.ID"
        :spot="spot"
        @booked="onBook"
        @click.native="selected(spot)"
      ></MoleculeSRPCard>
    </div>
    <div class="srp-map">
      <MapContainer
        class="map-container"
        :spotsList="spots"
        :key="reRender"
      ></MapContainer>
      <SearchInput class="map-search" @changed="onChange"></SearchInput>
    </div>
  </div>
</template>

<script>
import PaginationBody from '../extras/PaginationBody.vue';
import MoleculeSRPCard from '../molecules/MoleculeSRPCard.vue';
import MapContainer from '../extras/MapContainer.vue';
import SearchInput from '../extras/SearchInput.vue';
export default {
  name: 'TemplateSrp',
  components: {
    PaginationBody,
    MoleculeSRPCard,
    MapContainer,
    SearchInput,
  },
  props: {
    spots: {
      type: Array,
    },
    totals: {
      type: Number,
    },
    reRender: {
      type: Number,
    },
  },
  emits: ['changed', 'flyToSrp'],

  methods: {
    onPageChange(page) {
      this.$emit('changed', page);
    },
    onBook() {
      this.$router.push({ name: 'contactUs' });
    },
    onChange() {
      this.$emit('flyToSrp');
    },
    selected(spot) {
      console.log(spot);
    },
  },
};
</script>

<style scoped>
.srp-container {
  display: flex;
  gap: 2rem;
  padding-left: 3rem;
}

.srp-lists {
  flex: 20%;
  padding-top: 2rem;
}

.srp-map {
  flex: 60%;
}

.map-container {
  height: 100%;
  position: relative;
}

.map-search {
  left: 50%;
  position: absolute;
  top: 20%;
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

  .map-container {
    height: 50vh;
  }

  .map-search {
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
