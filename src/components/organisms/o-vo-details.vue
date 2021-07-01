<template>
  <div class="o_vo_details">
    <form v-on:submit.prevent="onSubmit">
      <!-- contact details -->
      <div class="columns">
        <div class="column">
          <atom-input
            class="input"
            :placeholder="contact.fullName"
            :required="required"
          />
        </div>
        <div class="column">
          <atom-input
            class="input"
            :placeholder="contact.email"
            :required="required"
            :types="contact.emailType"
          />
        </div>
        <div class="column">
          <atom-input
            class="input"
            :placeholder="contact.mno"
            :required="required"
            :types="contact.mobileType"
          />
        </div>
      </div>

      <!-- Address  -->
      <div class="columns">
        <div class="column">
          <atom-select
            @click.native.once="onCountry"
            class="select"
            :name="address.country"
            :id="address.country"
            :values="address.countryList"
          />
        </div>
        <div class="column">
          <atom-select
            class="select"
            :name="address.state"
            :id="address.state"
          />
        </div>
        <div class="column">
          <atom-input
            class="input"
            :placeholder="address.City"
            :required="required"
          />
        </div>
      </div>

      <!-- preferences -->

      <!-- Button -->
      <atom-button class="button" :text="submit" />
    </form>
  </div>
</template>

<script>
import AtomButton from "../atoms/atom-button/atom-button.vue";
import atomInput from "../atoms/atom-input/atom-input.vue";
import atomSelect from "../atoms/atom-select/atom-select.vue";
export default {
  components: { atomInput, atomSelect, AtomButton },
  name: "o-vo-details",
  data() {
    return {
      required: true,
      submit: "Submit Request",
      contact: {
        fullName: "Full Name",
        mno: "Mobile No.",
        email: "Email ID",
        emailType: "email",
        mobileType: "tel",
      },
      address: {
        City: "City",
        Country: "Country",
        State: "State",
        countryList: ["default"],
      },
    };
  },

  methods: {
    onCountry() {
      console.log("country");
      this.address.countryList = [
        ...this.address.countryList,
        "a",
        "b",
        "c",
        "d",
      ];
    },
    onSubmit() {
      console.log("hello");
    },
  },
};
</script>