<template>
  <div class="card" :class="getBorderClass()">
    <div class="card-content">
      <div class="columns is-multiline">
        <m-text-title
          class="column is-2"
          title="ID"
          :text="request.ID.toString()"
        />
        <m-text-title
          class="column is-2"
          title="Date"
          :text="request.CreatedAt.substr(0, 10)"
        />
        <m-text-title class="column is-2" title="Name" :text="request.Name" />
        <m-text-title
          class="column is-2"
          title="Mobile"
          :text="request.Mobile"
        />
        <m-text-title
          class="column is-2"
          title="Car Model"
          :text="request.CarModel"
        />
        <m-text-title
          class="column is-2"
          title="Duration"
          :text="request.Duration"
        />

        <m-text-title
          class="column is-2"
          title="Last Updated"
          :text="request.UpdatedAt.substr(0, 10)"
        />
        <m-text-title
          class="column is-2"
          title="Email"
          :text="request.EmailID"
        />
        <a target="_blank" class="column is-2" @click="toSrp">
          <m-text-title
            title="Lat / Lang"
            :text="
              request.Latitude.toFixed(6) + '/' + request.Longitude.toFixed(6)
            "
        /></a>
        <m-text-title
          class="column is-2"
          title="Landmark"
          :text="request.Landmark"
        />
        <m-text-title class="column is-2" title="City" :text="request.City" />
        <m-text-title class="column is-2" title="Priority" :text="priorityString" />
      </div>

      <div id="row3" class="columns is-vcentered">
        <div class="column is-one-fifth">
          <Datepicker :highlighted="highlighted" input-class="nextCallInput" format="yyyy-MM-dd" v-model="nextCallString" @input="setNextCall"></Datepicker>
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
          class="column is-one-fifth"
          text="Update"
          @click.native="updateRequest"
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
  name: "ORequestCard",
  components: {
    AtomButton,
    AtomTextarea,
    MTextTitle,
    AtomSelect,
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
          NextCall: "2022-01-18T09:56:27.3321676Z"
        };
      },
    },
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
        "Archive",
      ],
      priorityList: ["Not Set", "Low", "Medium", "High"],
      highlighted : {
        dates: [
          new Date()
        ]
    }
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
    nextCallString:{
      get() {
        return this.request.NextCall.substr(0, 10);
      }
    }
    
  },

  methods: {
    getBorderClass() {
      if (this.request.Priority == 3) {
        return "card--high";
      }
      if (this.request.Priority == 2) {
        return "card--medium";
      }
      return "card--low";
    },
    setNextCall(nextCall)
    {
        this.request.NextCall = nextCall
    },
    async updateRequest() {

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
      alert("Success: " + msg.Success);
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
.card--high {
  border-bottom: 10px solid rgb(255, 0, 0);
}
.card--medium {
  border-bottom: 10px solid rgb(240, 224, 107);
}
.card--low {
  border-bottom: 10px solid rgb(92, 92, 94);
}
</style>
 <style>
        .nextCallInput{
            width: 100%;
            border-radius: 15px;
            font-weight: 600;
            letter-spacing: 0.01em;
            font-size: 14px;
            height: 3.5em;
            margin-bottom: 5px;
            text-align: left;
            padding: 10px 
           }
    </style>
