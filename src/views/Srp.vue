<template>
  <section>
    <t-srp @on-book="onBookFormtoggle" />
    <SrpBookForm
      v-if="showBookForm"
      :showBookForm="showBookForm"
      :index="index"
      @on-cancel="onBookFormtoggles"
      @on-submit="onSubmit"
    />
    <BookMsg :resMsg="resMsg" v-if="resMsgflag" @on-cancel="onCancel" />
  </section>
</template>
<script>
import SrpBookForm from "@/pages/srp/components/SrpBookForm.vue";
import BookMsg from "@/pages/srp/components/BookMsg.vue";
import TSrp from "../components/templates/t-srp.vue";
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
  mounted() {
    console.log("srp0");
    console.log(this.$route);
  },
  methods: {
    async onSubmit(book) {
      this.showBookForm = !this.showBookForm;
      console.log(book);
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
