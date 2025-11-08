<template>
  <div class="sidebar">
    <h2>My Bookings</h2>
    <div class="filters">
      <button
        v-for="filter in filters"
        :key="filter"
        :class="{ active: filter === selectedFilter }"
        @click="$emit('filter-change', filter)"
      >
        {{ filter }}
      </button>
    </div>
    <div class="booking-list">
      <div
        v-for="booking in filteredBookings"
        :key="booking.id"
        class="booking-card"
      >
        <div class="booking-info">
          <p class="spot-name">{{ booking.spot }}</p>
          <span class="status-badge">{{ booking.status.toUpperCase() }}</span>
          <p>Payment: ₹{{ booking.payment }}</p>
        </div>
        <button class="view-btn" @click="$emit('view-booking', booking)">
          View
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookingSidebar',
  props: {
    bookings: Array,
    selectedFilter: String,
  },
  computed: {
    filters() {
      return ['Past', 'Active', 'Requested']
    },
    filteredBookings() {
      return this.bookings.filter(
        (b) => b.status.toLowerCase() === this.selectedFilter.toLowerCase()
      )
    },
  },
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 0px 10px #ddd;
}
h2 {
  margin-bottom: 15px;
}
.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.filters button {
  background-color: #e0e0e0;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}
.filters button.active {
  background-color: #007bff;
  color: white;
}
.booking-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.booking-card {
  background: #fefefe;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 1px 4px rgb(0 0 0 / 0.12);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.spot-name {
  font-weight: bold;
  margin: 0 0 5px 0;
  max-width: 140px;
}
.status-badge {
  background: #ddd;
  border-radius: 6px;
  padding: 3px 8px;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 8px;
  display: inline-block;
}
.view-btn {
  background-color: #007bff;
  border: none;
  color: white;
  padding: 7px 12px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}
.view-btn:hover {
  background-color: #0056b3;
}
</style>