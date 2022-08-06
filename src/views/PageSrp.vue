<template>
      <section>
            <TemplateSrp
                  :spots="paginatedSrpResults"
                  :totals="totalPages"
                  @changed="onPageChange"
                  :reRender="reRender"
            ></TemplateSrp>
            <LoaderModal :isLoading="isLoading"></LoaderModal>
      </section>
</template>
<script>
import TemplateSrp from "../components/templates/TemplateSrp.vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import LoaderModal from "../components/extras/LoaderModal.vue";
export default {
      name: "PageSrp",
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
                  paginatedSrpResults: "map/getPaginateSrpResults",
                  totalPages: "map/getTotalPages",
            }),
      },
      async mounted() {
            this.isLoading = true;
            await this.updateMapConfig([this.getLng(), this.getLat()]);
            await this.srpCall();
            this.reRender++;
            this.isLoading = false;
      },
      methods: {
            ...mapMutations({
                  updateMapCenter: "map/update-map-center",
                  updateMapConfig: "map/update-map-config",
                  updatePaginatedSrpData: "map/update-paginated-srp-data",
            }),
            ...mapActions({
                  srpCall: "map/srpCall",
                  updateCenterSrp: "map/update-center-srp",
            }),

            onPageChange(pageNum) {
                  this.isLoading = true;
                  this.updatePaginatedSrpData(pageNum);
                  this.updateCenterSrp();
                  this.reRender++;
                  this.isLoading = false;
            },
            // methods to get Lat and Long
            getLat: function () {
                  var queryParam = new URLSearchParams(window.location.search);
                  return queryParam.get("lat");
            },
            getLng: function () {
                  var queryParam = new URLSearchParams(window.location.search);
                  return queryParam.get("lng");
            },
      },
};
</script>
