<template>
  <section>
    <TemplateSrp
      :spots="paginatedSrpResults"
      :totals="totalPages"
      @changed="onPageChange"
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
      pageStart: 0,
      pageEnd: 2,
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
    this.updatePaginatedSrpData({
      from: this.pageStart,
      to: this.pageStart + 3,
    });
    this.pageStart = this.pageStart + 3;
  },
  methods: {
    ...mapMutations({
      updateMapCenter: "map/update-map-center",
      updatePaginatedSrpData: "map/update-paginated-srp-data",
    }),
    ...mapActions({
      srpCall: "map/srpCall",
    }),

    onPageChange() {
      this.updatePaginatedSrpData({
        from: this.pageStart,
        to: this.pageStart + 3,
      });
      this.pageStart = this.pageStart + 3;
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
