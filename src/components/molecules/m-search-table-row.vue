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
    <td>
      <atom-textarea
        :value="details.Comments"
        :disabled="true"
        :rows="1"
        :columns="200"
      />
    </td>
    <td>
      <atom-button
        class="is-small"
        :text="`Preview`"
        v-on:click.native="onPreview"
      ></atom-button>
    </td>
    <!-- <td>{{ details }}</td> -->
  </tr>
</template>

<script>
import AtomButton from "../atoms/atom-button/atom-button.vue";
import AtomTextarea from "../atoms/atom-input/atom-textarea.vue";
import AtomLink from "../atoms/atom-link/atom-link.vue";
import AtomRouterLink from "../atoms/atom-link/atom-router-link.vue";
import atomText from "../atoms/atom-text/atom-text.vue";
export default {
  components: { atomText, AtomLink, AtomTextarea, AtomRouterLink, AtomButton },
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
      switch (this.details.Status) {
        case 0:
          return this.statusDetails + "Request Status Not Set";

        case 1:
          return this.statusDetails + "Request Registered";

        case 2:
          return this.statusDetails + "Request Processing";

        case 3:
          return this.statusDetails + "Request Spot Suggested";

        case 4:
          return this.statusDetails + "Request Spot Accepted";

        case 5:
          return this.statusDetails + "Request Spot Denied";
      }
    },
  },

  methods: {
    toSrp() {
      let routeData = this.$router.resolve({
        name: "srp",
        query: { lat: this.details.Latitude, lng: this.details.Longitude },
      });
      window.open(routeData.href, "_blank");
    },
    onPreview() {
      this.$emit("is-preview", {
        comments: this.details.Comments,
        id: this.details.ID,
      });
    },
  },
};
</script>
<style scoped>
td {
  overflow: auto;
}
</style>