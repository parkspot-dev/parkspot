<template>
  <div class="my-bookings-container">
    <BookingSidebar
      :bookings="bookings"
      :selectedFilter="selectedFilter"
      @filter-change="handleFilterChange"
      @view-booking="handleViewBooking"
    />
    <BookingDetails
      v-if="selectedBooking"
      :booking="selectedBooking"
    />
    <div v-else class="placeholder">
      <p>Select a booking to see details</p>
    </div>
  </div>
</template>

<script>
import BookingSidebar from './BookingSidebar.vue'
import BookingDetails from './BookingDetails.vue'

export default {
  name: 'MyBookings',
  components: {
    BookingSidebar,
    BookingDetails,
  },
  data() {
    return {
      selectedFilter: 'Past',
      bookings: [
        {
          id: 1,
          spot: 'BTM Layout Parking',
          status: 'Past',
          payment: 150,
          billSummary: '₹150 - Paid',
          bookingDate: '2023-05-01',
          spotImage: 'https://via.placeholder.com/150?text=BTM+Layout',
        },
        {
          id: 2,
          spot: 'HSR Parking',
          status: 'Past',
          payment: 200,
          billSummary: '₹200 - Paid',
          bookingDate: '2023-05-10',
          spotImage: 'https://via.placeholder.com/150?text=HSR+Parking',
        },
        {
          id: 3,
          spot: 'Indiranagar Spot',
          status: 'Active',
          payment: 300,
          billSummary: '₹300 - Pending',
          bookingDate: '2023-06-01',
          spotImage: 'https://via.placeholder.com/150?text=Indiranagar',
        },
        {
          id: 4,
          spot: 'Whitefield Spot',
          status: 'Requested',
          payment: 0,
          billSummary: 'Request Pending',
          bookingDate: '2023-06-02',
          spotImage: 'https://via.placeholder.com/150?text=Whitefield',
        },
      ],
      selectedBooking: null,
    }
  },
  computed: {
    filteredBookings() {
      return this.bookings.filter(
        (b) => b.status.toLowerCase() === this.selectedFilter.toLowerCase()
      )
    },
  },
  methods: {
    handleFilterChange(filter) {
      this.selectedFilter = filter
      this.selectedBooking = null
    },
    handleViewBooking(booking) {
      this.selectedBooking = booking
    },
  },
}
</script>

<style scoped>
.my-bookings-container {
  display: flex;
  gap: 20px;
  padding: 20px;
}
.placeholder {
  flex-grow: 1;
  background: #fff;
  border-radius: 12px;
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #888;
  font-size: 18px;
}
</style>