<template>
  <div class="container">
    <div class="title">Layout details</div>
    <div class="columns">
      <div class="column is-6">
        <div class="subtitle">Car Map</div>
        <div class="columns is-multiline">
          <div
            :key="itemObjKey"
            class="column is-2"
            v-for="(tenantDetail, itemObjKey) in tenantInfos[id1 - 1]
              .ParkingStatus.SiteWise[id2].TotalSpots.Car"
          >
            <div class="mylayout">
              <div class="mybox" v-lazyload>
                <img :data-url="img1" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="subtitle">Bike Map</div>
        <div class="columns is-multiline">
          <div
            :key="itemObjKey"
            class="column is-2"
            v-for="(tenantDetail, itemObjKey) in tenantInfos[id1 - 1]
              .ParkingStatus.SiteWise[id2].TotalSpots.Bike"
          >
            <div class="mylayout">
              <div class="mybox" v-lazyload>
                <img :data-url="img2" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ParkingLayout",
  data() {
    return {
      img1: require("@/assets/portal/car.png"),
      img2: require("@/assets/portal/motorbike.png"),
    };
  },
  props: {
    tenantInfos: Array,
    id1: Number,
    id2: Number,
  },
};
</script>

<style scoped>
.mylayout {
  display: flex;
  justify-content: space-evenly;
}
.mybox {
  background-color: #ffdd57;
  outline: 1px solid #feffed;
  border: 3px solid #feffed;
  padding: 1px 1px;
  border-radius: 15%;
}
img {
  width: 40px;
}
</style>