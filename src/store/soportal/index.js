import { mayaClient } from "@/services/api";

const state = {
  contactForm: {},
  kycForm: {},
  additionalInfo: {},
  login: {},
};

const getters = {};

const mutations = {
  "update-contact"(state, data = {}) {
    state.contactForm = data;
  },
  "update-kyc"(state, data = {}) {
    state.kycForm = data;
  },
  "update-additional-info"(state, data = {}) {
    state.additionalInfo = data;
  },
  "update-login"(state, data = {}) {
    state.login = data;
  },
};

const actions = {
  register({ commit, state }) {
    const req = {
      UserName: "dummy_" + state.contactForm.fname + Date.now(),
      Password: "dummy@123",
      FullName: state.contactForm.fname + " " + state.contactForm.lname,
      City: "",
      EmailID: state.contactForm.email,
    };
    const loginReq = {
      Username: req.UserName,
      Password: req.Password,
    };
    commit("update-login", loginReq);
    mayaClient.post("/auth/register", req);
  },
  login({ state }) {
    mayaClient.post("/auth/login", state.login);
  },
  kyc({ state }) {
    const req = {
      ContactNo: state.contactForm.cno,
      UserName: state.login.UserName,
      Owner: state.kycForm.radioData,
      OwnerName: "none",
      // OwnerContactNo: "none",
      Relationship: "none",
      OwnershipDocument: "none",
      // IdentityDocument: "none",
      // OwnershipDocumentImage: "none",
    };
    mayaClient.patch("/kyc", req);
  },
  contact({ state }) {
    let convertedAmenities;
    state.additionalInfo.amenities.forEach((data) => {
      convertedAmenities += data + ",";
    });
    convertedAmenities = convertedAmenities.substring(
      0,
      convertedAmenities.length - 1
    );
    const req = {
      User: {
        UserName: state.login.UserName, //only for logged in user
        FullName: state.contactForm.fname + " " + state.contactForm.lname,
        City: "none",
        EmailID: state.contactForm.email,
        Mobile: state.contactForm.cno,
      },
      // Flavour: this.$store.getters["device/getFlavour"], //android, dweb, mweb
      Comments: "Spot Registered",
      RentDetails: {
        VehicleType: "",
        Rate: state.additionalInfo.rent,
        MinBookingDuration: state.additionalInfo.minDur,
        Availability: "",
        SpecialService: convertedAmenities, //None/Camera/Security
        TnC: "none",
        Address: "none",
      },
    };
    mayaClient.post("/contact", req);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
