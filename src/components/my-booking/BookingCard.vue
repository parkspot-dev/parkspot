<template>
  <div class="booking-card">
    <div class="left">
      <h3>{{ booking.spot }}</h3>
      <p>{{ booking.payment }}</p>
    </div>

    <div class="right">
      <span class="status" :class="booking.type">
        {{ booking.type.toUpperCase() }}
      </span>

      <a :href="booking.link" target="_blank" class="btn">
        Go to Spot
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "BookingCard",
  props: {
    booking: Object,
  },
};
</script>

<style scoped>
.booking-card {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 20px;
  background: #fff;
  border-radius: 14px;
  border: 1px solid #e5e5e5;

  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  transition: 0.3s ease;
}

.booking-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.12);
}

.left h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}

.left p {
  margin: 4px 0 0;
  font-size: 14px;
  color: #666;
}

.right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.status {
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

/* STATUS COLORS */
.status.active {
  background: #cce5ff;
  color: #005ecb;
}

.status.requested {
  background: #ffe0b3;
  color: #b36b00;
}

.status.past {
  background: #eaeaea;
  color: #555;
}

/* Button */
.btn {
  padding: 8px 20px;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  transition: 0.3s ease;
}

.btn:hover {
  background: #0062d6;
}
</style>
