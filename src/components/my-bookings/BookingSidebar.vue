<template>
  <div class="booking-sidebar">
    <!-- Header + Filter Buttons -->
    <div class="sidebar-header">
      <h2 class="sidebar-title">My Bookings</h2>

      <div class="filter-buttons">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="activeTab = tab"
          :class="{ active: activeTab === tab }"
        >
          {{ tab }}
        </button>
      </div>
    </div>

    <!-- Booking List -->
    <div class="booking-list">
      <div
        v-for="booking in filteredBookings"
        :key="booking.id"
        class="booking-card"
        @click="$emit('select-booking', booking)"
        :class="{ selected: selectedBooking && selectedBooking.id === booking.id }"
      >
        <div class="card-left">
          <img :src="booking.image" alt="booking" />
        </div>
        <div class="card-right">
          <p class="booking-id">Booking ID: <strong>{{ booking.id }}</strong></p>
          <h3>{{ booking.siteName }}</h3>
          <p class="address">{{ booking.address }}</p>

          <!-- Status badge -->
          <span class="status-badge" :class="booking.status.toLowerCase()">
            {{ booking.status }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BookingSidebar",
  props: {
    bookings: Array,
    selectedBooking: Object,
  },
  data() {
    return {
      tabs: ["Past", "Active", "Request"],
      activeTab: "Active",
    };
  },
  computed: {
    filteredBookings() {
      if (this.activeTab === "Active") {
        return this.bookings.filter((b) => b.status === "Active");
      } else if (this.activeTab === "Past") {
        return this.bookings.filter((b) => b.status === "Past");
      } else {
        return this.bookings.filter((b) => b.status === "Request");
      }
    },
  },
};
</script>

<style scoped lang="scss">
.booking-sidebar {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 85vh;
  overflow-y: auto;
}

/* Header Section */
.sidebar-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.sidebar-title {
  font-size: 20px;
  font-weight: 600;
  color: #2e2e48;
}

/* Filter Buttons */
.filter-buttons {
  display: flex;
  justify-content: space-between;
  background: #f3f4f6;
  border-radius: 8px;
  padding: 4px;
}

.filter-buttons button {
  flex: 1;
  background: transparent;
  border: none;
  font-weight: 500;
  font-size: 14px;
  color: #4b5563;
  padding: 8px 0;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

.filter-buttons button:hover {
  background: #e5e7eb;
}

.filter-buttons button.active {
  background: #4f46e5;
  color: #fff;
}

/* Booking Cards */
.booking-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.booking-card {
  display: flex;
  gap: 12px;
  background: #fafafa;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  align-items: center;
  border: 1px solid transparent;
}

.booking-card:hover {
  background: #f0f0ff;
}

.booking-card.selected {
  border: 1px solid #4f46e5;
  background: #eef2ff;
}

.card-left img {
  width: 60px;
  height: 50px;
  border-radius: 6px;
  object-fit: cover;
}

.card-right {
  flex: 1;
  text-align: left;
  position: relative;
}

.booking-id {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.card-right h3 {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.address {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

/* Status Badge */
.status-badge {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 6px;
  border-radius: 4px;
  text-transform: uppercase;
}

.status-badge.active {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.past {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.request {
  background: #dbeafe;
  color: #1e3a8a;
}
</style>
