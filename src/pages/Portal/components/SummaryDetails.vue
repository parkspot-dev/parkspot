<template>
  <div>
    <div class="columns mb-6">
      <div class="column is-4">
        <div class="mycontainer">
          <button v-on:click="onAdd" class="field button level-right ml-5">
            Add
          </button>
          <button v-on:click="onEdit" class="field button level-right ml-5">
            Edit
          </button>
        </div>
        <div
          @dblclick="layout(id, itemObjKey)"
          :key="itemObjKey"
          :class="[
            itemObjKey % 2 === 0
              ? 'has-background-warning'
              : 'has-background-black has-text-white',
            'box  ml-4',
          ]"
          v-for="(tenantDetail, itemObjKey) in tenantInfos[id - 1].ParkingStatus
            .SiteWise"
        >
          <div class="columns">
            <div class="column">
              <div class="field">{{ tenantDetail.Name }}</div>
            </div>
            <div class="column">
              <div class="field">
                Car Spots : <span>{{ tenantDetail.TotalSpots.Car }} </span>
              </div>
            </div>
            <div class="column">
              <div class="field">
                Bike Spots : <span>{{ tenantDetail.TotalSpots.Bike }}</span>
              </div>
            </div>
            <i
              v-if="showEdit"
              v-on:click="closeButton(tenantDetail.SiteID, id)"
              class="fa fa-window-close"
              aria-hidden="true"
            ></i>
          </div>
        </div>
      </div>
      <div class="column">
        <ParkingLayout
          :tenantInfos="tenantInfos"
          v-if="showLayout"
          :id1="id1"
          :id2="id2"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ParkingLayout from "./ParkingLayout.vue";
export default {
  name: "SummaryDetails",
  components: {
    ParkingLayout,
  },
  props: {
    tenantInfos: Array,
    id: Number,
  },
  data() {
    return {
      showEdit: false,
      showLayout: false,
      id1: "",
      id2: "",
    };
  },
  methods: {
    onAdd() {
      // console.log("here works")
      this.$emit("add-building-detail");
    },
    closeButton(id, index) {
      console.log(id, index);
      this.$emit("delete-detail-card", id, index);
    },
    onEdit() {
      console.log("edit clicked");
      this.showEdit = !this.showEdit;
    },
    layout(id1, id2) {
      console.log("layout clicked");
      this.showLayout = true;
      (this.id1 = id1), (this.id2 = id2);
    },
  },
};
</script>

<style scoped>
.mycontainer {
  display: flex;
}
</style>