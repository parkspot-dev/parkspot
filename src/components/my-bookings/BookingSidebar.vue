<template>
    <div class="booking-sidebar">
        <div class="sidebar-header">
            
            <div class="filter-buttons">
                <button
                    v-for="tab in tabs"
                    :key="tab"
                    @click="changeTab(tab)"
                    :class="{ active: activeTab === tab }"
                >
                    {{ tab }}
                </button>
            </div>
        </div>

        <div class="booking-list">
            <div
                v-for="booking in filteredBookings"
                :key="booking.BookingID"
                class="booking-card"
                @click="$emit('select-booking', booking)"
                :class="{
                    selected:
                        selectedBooking &&
                        selectedBooking.BookingID === booking.BookingID,
                }"
            >
                <div class="card-left">
                    <img
                        :src="booking?.SiteDetails?.SiteImageURI"
                        alt="booking"
                    />
                </div>
                <div class="card-right">
                    <p class="booking-id">
                        Booking ID: <strong>{{ booking.BookingID }}</strong>
                    </p>
                    <h3>{{ booking?.SiteDetails?.SiteName }}</h3>
                    <p class="address">{{ booking?.SiteDetails?.Address }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  name: 'BookingSidebar',
  props: {
    activebookings: { type: Array, default: () => [] },
    pastbookings: { type: Array, default: () => [] },
    requestbookings: { type: Array, default: () => [] },
    selectedBooking: Object,
  },

  data() {
    return {
      tabs: ['Past', 'Active', 'Request'],
      activeTab: 'Past',
      internalSelectedBooking: null,
    };
  },

  computed: {
    filteredBookings() {
      if (this.activeTab === 'Active') return this.activebookings;
      if (this.activeTab === 'Past') return this.pastbookings;
      if (this.activeTab === 'Request') return this.requestbookings;
      return [];
    },
    limitedBookings() {
      return this.filteredBookings.slice(0, 5);
    },
  },

  methods: {
    changeTab(tab) {
      this.activeTab = tab;
      this.autoSelectFirstBooking();
    },

    selectBooking(booking) {
      this.internalSelectedBooking = booking;
      this.$emit('select-booking', booking);
    },

    autoSelectFirstBooking() {
      const first = this.filteredBookings[0];
      if (first) {
        this.selectBooking(first);
      }
    },
  },

  mounted() {
    this.autoSelectFirstBooking();
  },
};
</script>


<style scoped lang="scss">
.booking-sidebar {
    background:var(--parkspot-white);
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    padding: 16px;
    display: flex;
    flex-direction: column;
    height: 85vh;
    overflow-y: auto;
}

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
    color: var(--parkspot-black);
    padding: 8px 0;
    border-radius: 6px;
    cursor: pointer;
    transition: 0.2s;
}



.filter-buttons button.active {
    background: var(--secondary-color);
    color: #fff;
}

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
    border: 2px solid;
    border-color: var(--secondary-color);
    background: var(--pr);
}

.card-left img {
    width: 80px;
    height: 100px;
    border-radius: 6px;
    object-fit: cover;
}

.card-right {
    flex: 4px;
    text-align: left;
    position: relative;
}

.booking-id {
    padding-top: 4px;
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
    margin-top:4px;
    font-size: 12px;
    color:black;
    margin-bottom: 8px;
}

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
.location-card {
  .location-box {
    background: #f9fafb;
    border-radius: 10px;
    padding: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    border: 1px solid #e5e7eb;
  }

  .loc-left h4 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: #111827;
  }

  .loc-left .addr {
    margin: 4px 0;
    font-size: 13px;
    color: #6b7280;
  }

  .site-id {
    font-size: 12px;
    color: #374151;
  }

  .navigate-btn {
    background: #2563eb;
    color: #fff;
    padding: px 16px;
    font-size: 13px;
    border-radius: 8px;
    font-weight: 600;
    text-decoration: none;
    transition: 0.2s ease;
    white-space: nowrap;
  }

  .navigate-btn:hover {
    background: #1e40af;
  }
}

</style>
