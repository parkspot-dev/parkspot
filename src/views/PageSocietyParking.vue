<template>
  <div class="container-main">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1>Simplify Your <span class="heighlight" >Society's</span> <br> Parking Experience</h1>
        <p>Smart parking management for residents, visitors & admins.</p>
        <button>Register Now</button>
      </div>
    </section>
  </div>
</template>

<script setup>
const submitForm = () => {
  alert("Form submitted! (This is a placeholder)");
};
</script>

<style scoped>
.container-main {
  color: #333;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
}

.heighlight {
  color: var(--primary-color);
  font-weight: bold;
}

/* Hero Section */
.hero {
  align-items: flex-start;
  background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url('https://media.gettyimages.com/id/1397252319/photo/red-car-paked-in-underground-garage-with-lots-of-vehicles.jpg?b=1&s=2048x2048&w=0&k=20&c=zYf5DmORC8KX0XsWX-pxzTQh615LZfIoGm2H3HCr_cM=');
  background-color: #222;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  color: white;
  display: flex;
  height: 90vh;
  justify-content: center;
  text-align: center;
}

.hero-content {
  border-radius: 10px;
  padding: 2rem;
  text-align: left;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  line-height: 60px;
}

.hero p {
  margin-bottom: 1rem;
}

.hero button {
  background-color: var(--primary-color);
  border-radius: 5px;
  border: none;
  color: #000;
  cursor: pointer;
  font-weight: bold;
  padding: 0.75rem 1.5rem;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
    line-height: 40px;
  }

  .hero-content {
    padding: 1rem;
    text-align: center;
  }
}
</style>
