export const inputMixins = {
  data() {
    return {
      toggle: false, // submit animation flag
      results: [],
      cresults: [],
      map: {
        temp: [77.586588, 12.969906],
        temp2: [[77.586588, 12.969906]],
        drag: true,
        key: 0,
        zooms: 11,
      },

      required: true,
      submit: "Submit Request",
      contact: {
        fullName: "Full Name",
        mno: "Mobile No.",
        email: "Email ID (Optional)",
        emailType: "email",
        mobileType: "tel",
      },
      address: {
        City: "City",
        countryList: ["India"],
        stateList: ["Karnataka"],
        location: "Nearest Location Address",
      },
      preference: {
        carModel: "Car Model/Name",
        durationList: [
          "Duration",
          "Less than 1 Month",
          "1 - 3 Month",
          "3 - 6 Month",
          "6 - 9 Month",
          "More than 9 Month",
        ],
        typeList: ["Type of Parking", "Coverd Parking", "Open Parking"],
      },
      // object created for v-model /data binding
      userForm: {
        fullName: "",
        email: "",
        mno: "",
        city: "",
        country: "India",
        state: "Karnataka",
        carModel: "",
        duration: "Duration",
        typeParking: "Type of Parking",
        location: "",
        mapPosLat: "",
        mapPosLng: "",
      },
    };
  },
  computed: {
    center() {
      if (this.userForm.location) {
        return this.map.temp;
      }
      return this.map.temp;
    },
    marker() {
      if (this.userForm.location) {
        return this.map.temp2;
      }
      return this.map.temp2;
    },
    zoom() {
      if (this.userForm.location) {
        return (this.zooms = 13);
      }
      return this.zooms;
    },
  },
  methods: {
    getLocation(loc) {
      this.userForm.mapPosLat = loc.lat;
      this.userForm.mapPosLng = loc.lng;
    },
    async search(name) {
      // console.log(name)
      if (!name.length) {
        this.results = [];
        return;
      }
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${name}.json?access_token=pk.eyJ1IjoiaWFtZmlhc2NvIiwiYSI6ImNrOWZiankzdjA5d2kzbWp3NGNzNmIwaHAifQ.E2UwYdvpjc6yNoCmBjfTaQ&proximity=77.4977,12.9716`
      );
      const data = await res.json();
      this.cresults = data.features;
      this.results = data.features.map((e) => e.place_name);
    },
    flytosrp(result) {
      this.userForm.location = result;
      for (let i = 0; i < this.results.length; i++) {
        if (this.results[i] === result) {
          this.map.key += 1;
          this.map.temp = [...this.cresults[i].center];
          this.map.temp2[0] = this.cresults[i].center;
        }
      }
    },
  },
};
