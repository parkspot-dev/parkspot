<template>
  <div class="mybooking-page">
    <MyBookingLayout>
      
      <div class="sidebar">
        <BookingTab
          :active-tab="activeTab"
          @change-tab="changeTab"
        />
      </div>

      <div class="booking-content">
        <BookingList :tab="activeTab" />
      </div>

    </MyBookingLayout>
  </div>
</template>

<script>
import MyBookingLayout from "@/components/my-booking/MyBookingLayout.vue";
import BookingTab from "@/components/my-booking/BookingList.vue";   
import BookingList from "@/components/my-booking/BookingList.vue"; 

export default {
  name: "PageMyBooking",
  components: {
    MyBookingLayout,
    BookingTab,
    BookingList,
  },

  data() {
    return {
      activeTab: "past",
    };
  },

  methods: {
    changeTab(tab) {
      this.activeTab = tab;
    },
  },
};
</script>

<style scoped>
.mybooking-page {
  display: flex;
  flex-direction: column;
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.sidebar {
  margin-bottom: 25px;
}

.booking-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
