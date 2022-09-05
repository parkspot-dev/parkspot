<template>
  <section>
    <TemplateSrp
      :spots="paginatedSrpResults"
      :totals="totalPages"
      @changed="onPageChange"
      :reRender="reRender"
      @flyToSrp="flyToSrp"
    ></TemplateSrp>
    <LoaderModal :isLoading="isLoading"></LoaderModal>
  </section>
</template>
<script>
import TemplateSrp from '../components/templates/TemplateSrp.vue';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import LoaderModal from '../components/extras/LoaderModal.vue';
export default {
  name: 'PageSrp',
  components: {
    TemplateSrp,
    LoaderModal,
  },
  data() {
    return {
      reRender: 0,
      isLoading: false,
    };
  },
  computed: {
    ...mapGetters({
      paginatedSrpResults: 'map/getPaginateSrpResults',
      totalPages: 'map/getTotalPages',
      LocDetails: 'map/getLocDetails',
    }),
  },
  async mounted() {
    try {
      this.isLoading = true;
      await this.updateMapConfig(this.getLatLng()); // map center takes [lng, lat]
      await this.srpCall();
      this.reRender++;
      this.isLoading = false;
    } catch (error) {
      console.log(error);
      this.$router.push({ name: 'error', params: { msg: error } });
    }
  },
  methods: {
    ...mapMutations({
      updateMapCenter: 'map/update-map-center',
      updateMapConfig: 'map/update-map-config',
      updatePaginatedSrpData: 'map/update-paginated-srp-data',
    }),
    ...mapActions({
      srpCall: 'map/srpCall',
      updateCenterSrp: 'map/update-center-srp',
    }),

    onPageChange(pageNum) {
      this.isLoading = true;
      this.updatePaginatedSrpData(pageNum);
      this.updateCenterSrp();
      this.reRender++;
      this.isLoading = false;
    },
    // methods to get Lat and Long

    getLatLng() {
      const queryParam = new URLSearchParams(window.location.search);
      const latlng = queryParam.get('latlng').split(',');
      latlng.reverse(); // map center takes [lng, lat] so reverse() used
      return latlng;
    },

    flyToSrp() {
      this.$nextTick(() => {
        let latlng = [...this.LocDetails.lnglat];
        latlng = latlng.reverse().toString();
        this.$router.push({
          name: 'srp',
          query: {
            latlng,
          },
          params: {
            location: this.LocDetails.locDetails.locName,
          },
        });
      });
    },
  },
};
</script>
