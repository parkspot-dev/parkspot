<template>
  <section>
    <t-srp @on-book="onBookFormtoggle" />
    <SrpBookForm
      v-if="showBookForm"
      :show-book-form="showBookForm"
      :index="index"
      @on-cancel="onBookFormtoggles"
      @on-submit="onSubmit"
    />
    <BookMsg v-if="resMsgflag" :res-msg="resMsg" @on-cancel="onCancel" />
  </section>
</template>
<script>
import SrpBookForm from "@/pages/srp/components/SrpBookForm.vue";
import BookMsg from "@/pages/srp/components/BookMsg.vue";
import TSrp from "../components/templates/t-srp.vue";
import mapbox from "../thirdparty/mapbox";
export default {
  name: "PSSrp",
  components: {
    SrpBookForm,
    BookMsg,
    TSrp,
  },
  data() {
    return {
      showBookForm: false,
      index: "",
      resMsg: "",
      resMsgflag: false,
    };
  },
  created() {
    mapbox.addMapboxScript();
  },
  methods: {
    async onSubmit(book) {
      this.showBookForm = !this.showBookForm;
      const res = await fetch("https://maya.parkspot.in/booking/tentative", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          SiteID: book.ID,
          StartTime: "20200815t1500",
          EndTime: "20200815t1800",
          UserInfo: {
            Name: book.name,
            Mobile: book.mno,
            EmailID: book.email,
            VehicleNO: "KA01JE3635",
          },
        }),
      });
      const data = await res.json();
      this.resMsg = data;
      this.resMsgflag = !this.resMsgflag;
    },
    onBookFormtoggle(index) {
      this.showBookForm = !this.showBookForm;
      this.index = index;
    },
    onBookFormtoggles() {
      this.showBookForm = !this.showBookForm;
    },
    onCancel() {
      this.resMsgflag = !this.resMsgflag;
    },
  },
};
</script>
