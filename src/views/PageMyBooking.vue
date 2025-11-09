<template>
  <div class="page-my-booking">
    <h1 class="page-title">My Bookings</h1>

    <div class="booking-layout">
      <!-- Sidebar -->
      <BookingSidebar
        :bookings="activeBookings"
        :selectedBooking="selectedBooking"
        @select-booking="onSelectBooking"
      />

      <!-- Right Details -->
      <BookingDetails
        :booking="selectedBooking"
        @payment-link="onPaymentLink"
        @refresh-payment="onRefreshPayment"
      />
    </div>
  </div>
</template>

<script>
import BookingSidebar from "@/components/my-bookings/BookingSidebar.vue";
import BookingDetails from "@/components/my-bookings/BookingDetails.vue";

export default {
  name: "PageMyBooking",
  components: { BookingSidebar, BookingDetails },
  data() {
    return {
      selectedBooking: null,
      activeBookings: [
        {
          id: "B001",
          siteName: "Downtown Parking",
          siteCode: "DP-01",
          address: "MG Road, Pune",
          image: "https://via.placeholder.com/100x70?text=Parking+1",
          status: "Active",
          latitude: 18.5204,
          longitude: 73.8567,
          startTime: "2025-11-09T10:00:00",
          endTime: "2025-11-09T12:00:00",
          slot: "A-12",
          vehicle: "MH12AB1234",
          duration: "2 hrs",
          billingCycle: "Hourly",
          payment: { baseRent: 120, fees: 30, discount: 0, status: "Pending" },
        },
        {
          id: "B002",
          siteName: "City Center Mall",
          siteCode: "CCM-22",
          address: "FC Road, Pune",
          image: "https://via.placeholder.com/100x70?text=Parking+2",
          status: "Active",
          latitude: 18.5167,
          longitude: 73.8415,
          startTime: "2025-11-10T09:00:00",
          endTime: "2025-11-10T11:00:00",
          slot: "B-07",
          vehicle: "MH14CD4567",
          duration: "2 hrs",
          billingCycle: "Hourly",
          payment: { baseRent: 100, fees: 20, discount: 10, status: "Paid" },
        },
        {
          id: "B003",
          siteName: "Airport Lot",
          siteCode: "AIR-09",
          address: "Viman Nagar, Pune",
          image: "https://via.placeholder.com/100x70?text=Parking+3",
          status: "Active",
          latitude: 18.5667,
          longitude: 73.9167,
          startTime: "2025-11-11T15:00:00",
          endTime: "2025-11-11T18:00:00",
          slot: "C-03",
          vehicle: "MH12EF7890",
          duration: "3 hrs",
          billingCycle: "Hourly",
          payment: { baseRent: 150, fees: 30, discount: 0, status: "Pending" },
        },
      ],
    };
  },
  methods: {
    onSelectBooking(booking) {
      this.selectedBooking = booking;
    },
    onPaymentLink(id) {
      alert(`Get payment link for Booking ID: ${id}`);
    },
    onRefreshPayment(id) {
      alert(`Refresh payment for Booking ID: ${id}`);
    },
  },
};
</script>

<style scoped lang="scss">
.page-my-booking {
  background: #f5f5fb;
  min-height: 100vh;
  padding: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 20px;
}

.booking-layout {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

/* Sidebar */
.booking-layout > *:first-child {
  width: 300px;
  flex-shrink: 0;
}

/* Details section */
.booking-layout > *:last-child {
  flex: 1;
}

/* ✅ Responsive */
@media (max-width: 992px) {
  .booking-layout {
    flex-direction: column;
  }

  .booking-layout > *:first-child {
    width: 100%;
  }
}
</style>
