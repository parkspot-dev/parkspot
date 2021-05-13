<template>
  <section>
    <PSNavbar />
    <SRP />
    <PSSrpDetails @on-book="onBookFormtoggle" />
    <SrpBookForm
      v-if="showBookForm"
      :showBookForm="showBookForm"
      :index="index"
      @on-cancel="onBookFormtoggles"
      @on-submit="onSubmit"
    />
	<BookMsg :resMsg="resMsg" v-if="resMsgflag"  @on-cancel="onCancel"/>
	<!--  -->
    <PSFooter />
  </section>
</template>
<script>
import PSNavbar from "@/components/PSNavbar.vue";
import PSFooter from "@/components/PSFooter.vue";
import SRP from "@/pages/srp/components/PSSrp.vue";
import PSSrpDetails from "@/pages/srp/components/PSSrpDetails.vue";
import SrpBookForm from "@/pages/srp/components/SrpBookForm.vue";
import BookMsg from "@/pages/srp/components/BookMsg.vue";
export default {
  name: "PSSrp",
  components: {
    PSNavbar,
    PSFooter,
    SRP,
    PSSrpDetails,
    SrpBookForm,
	BookMsg
  },
  data() {
    return {
      showBookForm: false,
      index: "",
	  resMsg:"",
	  resMsgflag:false	  
    };
  },
  methods: {
    async onSubmit(book) {
      //console.log("HEllo")
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
            EmailID:book.email,
            VehicleNO: "KA01JE3635",
          },
        }),
      });
      const data = await res.json();
      // const check =JSON.parse(data)
      console.log(data);
	  this.resMsg = data;
	  this.resMsgflag = !this.resMsgflag
	  
    },
    onBookFormtoggle(index) {
      this.showBookForm = !this.showBookForm;
      // console.log(index)
      // console.log(this.showBookForm)
      this.index = index;
    },
    onBookFormtoggles() {
      this.showBookForm = !this.showBookForm;
    },
	onCancel(){
		this.resMsgflag = !this.resMsgflag
	}
  },
};
</script>
