<template>
  <div class="columns is-vcentered">
    <div class="column is-3">
      <label class="label">Select Tenants:</label>
      <div class="select">
        <select v-model="myid" v-on:change="onChange(myid)">
          <option
            :key="tenant.TID"
            v-for="tenant in tenants"
            :value="tenant.TID"
          >
            {{ tenant.Name }}
          </option>
        </select>
      </div>
    </div>
    <div class="column is-3">
      <div class="box has-background-warning">
        <div class="field">
          Total No. of Parking Spots:
          <span>{{
            tenantInfos[myid - 1].TotalSpots.Car +
            tenantInfos[myid - 1].TotalSpots.Bike
          }}</span>
        </div>
        <div class="columns">
          <div class="column">
            <div class="field">
              Car : <span>{{ tenantInfos[myid - 1].TotalSpots.Car }}</span>
            </div>
          </div>
          <div class="column">
            <div class="field">
              Bike : <span>{{ tenantInfos[myid - 1].TotalSpots.Bike }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="column is-3">
      <div class="box has-background-success">
        <div class="field">
          Total No. of Vacant Spots:
          <span>{{
            tenantInfos[myid - 1].VacantSpots.Car +
            tenantInfos[myid - 1].VacantSpots.Bike
          }}</span>
        </div>
        <div class="columns">
          <div class="column">
            <div class="field">
              Car : <span>{{ tenantInfos[myid - 1].VacantSpots.Car }}</span>
            </div>
          </div>
          <div class="column">
            <div class="field">
              Bike : <span>{{ tenantInfos[myid - 1].VacantSpots.Bike }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="column is-3">
      <div class="box has-background-info">
        Total No. of Buildings :
        <span>{{ tenantInfos[myid - 1].ParkingStatus.SiteWise.length }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SummaryInfo",
  props: {
    tenants: Array,
    tenantInfos: Array,
    id: Number, //this id is used as myid
  },
  data() {
    return {
      myid: this.id,
    };
  },
  methods: {
    onChange(myid) {
      this.$emit("tenant-id", myid);
      // console.log(myid)
    },
  },
};
</script>

<style scoped>
</style>