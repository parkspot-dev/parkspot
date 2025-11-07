<template>
  <div class="flex h-screen bg-gray-100">

    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r p-4">
      <h2 class="text-xl font-semibold mb-4">My Bookings</h2>

      <ul>
        <li
          v-for="item in tabs"
          :key="item.key"
          @click="activeTab = item.key"
          class="cursor-pointer p-2 rounded mb-1"
          :class="activeTab === item.key ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'"
        >
          {{ item.label }}
        </li>
      </ul>
    </aside>

    <!-- Page Content -->
    <main class="flex-1 p-6 overflow-auto">
      <BookingList :bookings="filteredBookings" />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import BookingList from "./BookingList.vue";

const activeTab = ref("active");

const tabs = [
  { key: "active", label: "Active" },
  { key: "requested", label: "Requested" },
  { key: "past", label: "Past" },
];

// Sample Data
const bookings = ref([
  {
    id: 1,
    status: "active",
    spotName: "Parkspot Mall Parking",
    date: "2025-01-10",
    amount: 120,
  },
  {
    id: 2,
    status: "requested",
    spotName: "Airport Parking - T3",
    date: "2025-01-12",
    amount: 180,
  },
  {
    id: 3,
    status: "past",
    spotName: "Cyber City Basement Parking",
    date: "2024-12-04",
    amount: 90,
  },
]);

const filteredBookings = computed(() =>
  bookings.value.filter((b) => b.status === activeTab.value)
);
</script>
