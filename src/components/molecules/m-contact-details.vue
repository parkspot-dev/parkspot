<template>
  <div>
    <label class="is-size-5 is-size-6-mobile"
      >Contact Details <span style="color: red">*</span> :</label
    >
    <div class="columns">
      <div class="column">
        <atom-input
          v-model="fullName"
          class="input"
          :placeholder="'Full Name'"
          :required="true"
        />
      </div>
      <div class="column">
        <atom-input
          v-model="email"
          class="input"
          :placeholder="'Email ID (Optional)'"
          :types="'email'"
        />
      </div>
      <div class="column">
        <atom-input
          v-model="mno"
          class="input"
          :placeholder="'Mobile No.'"
          :required="true"
          :types="'tel'"
        />
      </div>
    </div>
  </div>
</template>

<script>
import atomInput from "../atoms/atom-input/atom-input.vue";
export default {
  components: { atomInput },
  name: "m-contact-details",
  props: {
    fullName: String,
    email: String,
    mno: Number,
  },
  data() {
    return {
      //   fullName: "",
      //   email: "",
      //   mno: "",
    };
  },
};
</script>