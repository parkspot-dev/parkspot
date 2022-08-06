<template>
      <section>
            <TemplateSrp
                  :spots="paginatedSrpResults"
                  :totals="totalPages"
                  @changed="onPageChange"
                  :reRender="reRender"
            ></TemplateSrp>
      </section>
</template>
<script>
import TemplateSrp from "../components/templates/TemplateSrp.vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
      name: "PageSrp",
      components: {
            TemplateSrp,
      },
      data() {
            return {
                  pageStart: 1,
                  reRender: 0,
            };
      },
      computed: {
            ...mapGetters({
                  paginatedSrpResults: "map/getPaginateSrpResults",
                  totalPages: "map/getTotalPages",
            }),
      },
      async mounted() {
            await this.updateMapCenter([this.getLng(), this.getLat()]);
            await this.srpCall();
            this.updatePaginatedSrpData(this.pageStart);
            this.reRender++;
            this.updateCenterSrp();
      },
      methods: {
            ...mapMutations({
                  updateMapCenter: "map/update-map-center",
                  updatePaginatedSrpData: "map/update-paginated-srp-data",
                  updateCenterSrp: "map/update-center-srp",
            }),
            ...mapActions({
                  srpCall: "map/srpCall",
            }),

            onPageChange(pageNum) {
                  this.updatePaginatedSrpData(pageNum);
                  this.updateCenterSrp();
                  this.reRender++;
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
