<template>
  <div class="card">
    <div class="card-content">
      <div id="row1" class="columns">
        <m-text-title class="column" title="ID" :text="request.ID.toString()" />
        <m-text-title
          class="column"
          title="Date"
          :text="request.CreatedAt.substr(0, 10)"
        />
        <m-text-title class="column" title="Name" :text="request.Name" />
        <m-text-title class="column" title="Mobile" :text="request.Mobile" />
        <m-text-title
          class="column"
          title="Car Model"
          :text="request.CarModel"
        />
        <m-text-title
          class="column"
          title="Duration"
          :text="request.Duration"
        />
      </div>

      <div id="row2" class="columns">
        <m-text-title
          class="column"
          title="Last Updated"
          :text="request.UpdatedAt.substr(0, 10)"
        />
        <m-text-title class="column" title="Email" :text="request.EmailID" />
        <a v-on:click="toSrp" target="_blank">
          <m-text-title
            class="column"
            title="Lat/Lang"
            :text="
              request.Latitude.toFixed(6) + '/' + request.Longitude.toFixed(6)
            "
        /></a>
        <m-text-title
          class="column"
          title="Landmark"
          :text="request.Landmark"
        />
        <m-text-title class="column" title="City" :text="request.City" />
      </div>

      <div id="row3" class="columns is-vcentered">
        <div class="column is-one-fifth">
          <atom-select
            id="priority"
            v-model="priorityString"
            class="select"
            :values="priorityList"
          />
          <atom-select
            id="status"
            v-model="statusString"
            class="select"
            :values="statusList"
          />
        </div>
        <div class="column">
          <atom-textarea
            v-model="request.Comments"
            class="textarea mb-2"
            :rows="3"
          />
        </div>
        <atom-button
          @click.native="updateRequest"
          class="column is-one-fifth"
          text="Update"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AtomButton from "@/components/atoms/atom-button/atom-button.vue";
import AtomTextarea from "@/components/atoms/atom-input/atom-textarea.vue";
import MTextTitle from "@/components/molecules/m-text-title.vue";
import AtomSelect from "@/components/atoms/atom-select/atom-select.vue";

export default {
  name: "o-request-card",
  components: {
    AtomButton,
    AtomTextarea,
    MTextTitle,
    AtomSelect,
  },
  data() {
    return {
      statusList: [
        "StatusNotSet",
        "Registered",
        "Processing",
        "SpotSuggested",
        "SpotAccepted",
        "SpotDenied",
        "NotFulfiled",
      ],
      priorityList: ["Not Set", "Low", "Medium", "High"],
    };
  },
  computed: {
    statusString: {
      get() {
        return this.statusList[this.request.Status];
      },
      set(statusString) {
        this.request.Status = this.statusList.indexOf(statusString);
      },
    },
    priorityString: {
      get() {
        return this.priorityList[this.request.Priority];
      },
      set(priorityString) {
        this.request.Priority = this.priorityList.indexOf(priorityString);
      },
    },
  },
  props: {
    request: {
      type: Object,
      default() {
        return {
          ID: 75,
          CreatedAt: "2022-01-18T09:56:27.3321676Z",
          UpdatedAt: "2022-01-18T09:56:27.3321676Z",
          DeletedAt: {
            Time: "0001-01-01T00:00:00Z",
            Valid: false,
          },
          Name: "Default",
          Mobile: "8904033703",
          EmailID: "eisha.sethi3@gmail.com",
          Country: "",
          State: "Jharkhand",
          City: "Ranchi",
          Latitude: 12.122,
          Longitude: 76.21234,
          Landmark: "Lowadih",
          CarModel: "Honda Amaze",
          MinPrice: 0,
          MaxPrice: 200,
          Duration: "9 months",
          Status: 2,
          Priority: 3,
          Comments: "Received Tentative Request.",
        };
      },
    },
  },

  methods: {
    async updateRequest() {
      console.log("updating request:", this.request);
      const res = await fetch(
        "https://maya.parkspot.in/owner/request-comments",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.request),
        }
      );
      const msg = await res.json();
      console.log({ msg });
      // alert popup to show update success or failure
    },
    toSrp() {
      let routeData = this.$router.resolve({
        name: "srp",
        query: { lat: this.request.Latitude, lng: this.request.Longitude },
      });
      window.open(routeData.href, "_blank");
    },
  },
};
</script>

<style scoped>
.card {
  margin: 5px 25px;
  border: 2px solid;
  border-bottom: 10px solid rgb(240, 224, 107);
}
</style>
