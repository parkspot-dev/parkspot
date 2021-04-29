<template>
  <div :class="[showAdd ? 'is-active' : '', 'modal']">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Add Site Details</p>
        <button
          v-on:click="closeModal"
          class="delete"
          aria-label="close"
        ></button>
      </header>
      <section class="modal-card-body">
        <!-- Content ... -->
        <div class="field">
          <label class="label">Site Name</label>
          <div class="control">
            <input
              v-model="Site"
              class="input"
              type="text"
              placeholder="Site Name"
            />
          </div>
        </div>
        <div class="field">
          <label class="label">No. of Car Spots</label>
          <div class="control">
            <input v-model="CarSpots" class="input" type="Number" />
          </div>
        </div>
        <div class="field">
          <label class="label">No. of Bike Spots</label>
          <div class="control">
            <input v-model="BikeSpots" class="input" type="Number" />
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button v-on:click="addSite(id)" class="button is-success">
          Save changes
        </button>
        <button v-on:click="closeModal" class="button">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddBuildingDetails",
  props: {
    showAdd: Boolean,
    id: Number,
  },
  data() {
    return {
      Site: "",
      CarSpots: "",
      BikeSpots: "",
    };
  },
  methods: {
    closeModal() {
      // console.log("hello")
      this.$emit("close-modal");
    },
    addSite(id) {
      //   console.log("hello")
      if (!this.Site) {
        alert("Please fill Site Details");
      }
      const newSite = {
        Name: this.Site,
        TotalSpots: {
          Car: this.CarSpots,
          Bike: this.BikeSpots,
        },
      };
      // console.log(newSite)
      this.$emit("add-site", newSite, id);

      (this.Site = ""), (this.CarSpots = ""), (this.BikeSpots = "");
    },
  },
};
</script>