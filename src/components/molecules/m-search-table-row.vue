<template>
  <tr>
    <td><atom-text :text="details.ID" /></td>
    <td><atom-text :text="details.Name" /></td>
    <td><atom-text :text="details.Mobile" /></td>
    <td><atom-text :text="details.CarModel" /></td>
    <td><atom-text :text="details.Landmark" /></td>
    <td><atom-text :text="details.Country" /></td>
    <td><atom-text :text="details.State" /></td>
    <td><atom-text :text="details.City" /></td>
    <td><atom-text :text="details.Duration" /></td>
    <td>
      <a v-on:click="toSrp" target="_blank"
        >{{ details.Latitude }},{{ details.Longitude }},</a
      >
    </td>
    <td><atom-text :text="statusDetail" /></td>
    <td><atom-textarea :value="details.Comments" :disabled="true" /></td>
    <!-- <td>{{ details }}</td> -->
  </tr>
</template>

<script>
import AtomTextarea from "../atoms/atom-input/atom-textarea.vue";
import AtomLink from "../atoms/atom-link/atom-link.vue";
import AtomRouterLink from "../atoms/atom-link/atom-router-link.vue";
import atomText from "../atoms/atom-text/atom-text.vue";
export default {
  components: { atomText, AtomLink, AtomTextarea, AtomRouterLink },
  name: "m-search-table-row",
  props: {
    details: Object,
    mapUrl: String,
  },
  data() {
    return {
      statusDetails: "",
    };
  },
  computed: {
    statusDetail() {
      if (this.details.Status === 0) {
        return this.statusDetails + "Request Status Not Set";
      } else if (this.details.Status === 1) {
        return this.statusDetails + "Request Registered";
      } else if (this.details.Status === 2) {
        return this.statusDetails + "Request Processing";
      } else if (this.details.Status === 3) {
        return this.statusDetails + "Request Spot Suggested";
      } else if (this.details.Status === 4) {
        return this.statusDetails + "Request Spot Accepted";
      } else if (this.details.Status === 5) {
        return this.statusDetails + "Request Spot Denied";
      } else {
        return this.statusDetails;
      }
    },
  },
  methods: {
    toSrp() {
      // console.log("ljdslafj");
      let routeData = this.$router.resolve({
        name: "srp",
        query: { lat: this.details.Latitude, lng: this.details.Longitude },
      });
      // console.log(routeData);
      window.open(routeData.href, "_blank");
    },
  },
};
</script>