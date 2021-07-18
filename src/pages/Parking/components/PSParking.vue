<template>
  <div class="container">
    <div class="title mt-5">List of Parking Spot available in Bengaluru!!</div>
    <div class="card-content subtitle">
      <a
        v-on:click="onClick(item.name)"
        class="has-text-link"
        v-for="item in pageOfItems"
        askdknad
        :key="item.id"
        >{{ item.name }}</a
      >
    </div>
    <div class="card-footer pb-0 pt-3">
      <jw-pagination
        :items="listOfPlaces"
        @changePage="onChangePage"
        class="pagination-link mb-5"
      ></jw-pagination>
    </div>
  </div>
</template>

<script>
const listOfPlaces = [
  { id: 1, name: "Jayanagar" },
  {
    id: 2,
    name: "Vijaynagar",
  },
  {
    id: 3,
    name: "Banashankari",
  },
  {
    id: 4,
    name: "Marathahalli",
  },
  {
    id: 5,
    name: "BTM Layout",
  },
];

export default {
  name: "PSParking",
  data() {
    return {
      listOfPlaces,
      pageOfItems: [],
    };
  },
  methods: {
    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },
    onClick(Pname) {
      console.log(Pname);
      this.$router.push({
        name: "PSTemplate",
        params: {
          id: Pname,
          places: Pname,
        },
      });
    },
  },
};
</script>

<style scoped>
a {
  display: block;
}
</style>