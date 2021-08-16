<template>
  <div class="o_search_table">
    <table class="table">
      <thead>
        <th><atom-text :text="ID" /></th>
        <th><atom-text :text="tname" /></th>
        <th><atom-text :text="tcarModel" /></th>
        <th><atom-text :text="tnearestLocation" /></th>
        <th><atom-text :text="tcountry" /></th>
        <th><atom-text :text="tstate" /></th>
        <th><atom-text :text="tcity" /></th>
        <th><atom-text :text="tduration" /></th>
        <th><atom-text :text="tmapUrl" /></th>
        <th><atom-text :text="tspotProvided" /></th>
        <th><atom-text :text="tcomment" /></th>
        <th>
          <atom-button class="button is-warning is-light" :text="button" />
        </th>
      </thead>

      <tbody>
        <m-search-table-row
          :key="spot.ID"
          v-for="spot in spotDetails"
          :details="spot"
        />
      </tbody>
    </table>
  </div>
</template>
<script>
import AtomButton from "../atoms/atom-button/atom-button.vue";
import AtomText from "../atoms/atom-text/atom-text.vue";
import mSearchTableRow from "../molecules/m-search-table-row.vue";
export default {
  components: { mSearchTableRow, AtomText, AtomButton },
  name: "o-search-table",
  data() {
    return {
      ID: "ID",
      tname: "Name",
      tcountry: "Country",
      tstate: "State",
      tcity: "City",
      tnearestLocation: "Nearest Location",
      tmapUrl: "Map URL",
      tcarModel: "Car Model",
      tduration: "Duration",
      tspotProvided: "Spot Provided",
      tcomment: "Comments",
      button: "Edit",
      spotDetails: [],
    };
  },
  mounted() {
    this.getSpotDetails();
  },
  methods: {
    async getSpotDetails() {
      const res = await fetch(
        "https://maya.parkspot.in/internal/parking-requets"
      );
      const data = await res.json();
      this.spotDetails = data;
      // console.log(this.spotDetails);
    },
  },
};
</script>