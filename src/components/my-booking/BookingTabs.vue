<template>
  <div class="booking-tabs">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      :class="['tab-btn', { active: tab.value === activeTab }]"
      @click="$emit('change-tab', tab.value)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script>
export default {
  name: "BookingTab",
  props: { activeTab: String },
  data() {
    return {
      tabs: [
        { label: "Past", value: "past" },
        { label: "Active", value: "active" },
        { label: "Requested", value: "requested" },
      ],
    };
  },
};
</script>

<style scoped>
.booking-tabs {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.tab-btn {
  padding: 12px 28px;
  border-radius: 10px;
  border: none;
  background: rgba(220, 220, 220, 0.5);
  backdrop-filter: blur(5px);
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s ease;
  font-size: 15px;
}

.tab-btn:hover {
  background: rgba(180, 180, 180, 0.6);
  transform: translateY(-2px);
}

.tab-btn.active {
  background: #007bff;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.4);
}
</style>
