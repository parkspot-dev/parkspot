<template>
  <div>
    <!-- Header / Navbar -->
    <header class="header">
      <div class="container">
        <div class="logo">ParkSpot</div>
        <nav class="nav">
          <ul>
            <li class="dropdown">
              <a href="#">Company ▼</a>
              <ul class="dropdown-menu">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Team</a></li>
                <li><a href="#">Careers</a></li>
              </ul>
            </li>
            <li class="dropdown">
              <a href="#">Agent Portal ▼</a>
              <ul class="dropdown-menu">
                <li><a href="#">Login</a></li>
                <li><a href="#">Signup</a></li>
              </ul>
            </li>
            <li><a href="#">Request Spot</a></li>
            <li><a href="#">Register Spot</a></li>
          </ul>
        </nav>
        <div class="contact-info">
          <i class="phone-icon">📞</i> +91 74882 39471
          <img class="profile-pic" src="https://via.placeholder.com/32" alt="Profile"/>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <MyBookings />
    </main>
  </div>
</template>

<script>
import MyBookings from '../my-booking/MyBookings.vue'

export default {
  name: 'MyBookingsView',
  components: {
    MyBookings,
  },
}
</script>

<style scoped>
/* Header styling */
.header {
  background: #fff;
  box-shadow: 0 2px 5px rgb(0 0 0 / 0.1);
  padding: 10px 20px;
  position: sticky;
  top: 0;
  z-index: 100;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.logo {
  font-family: 'Arial Black', Arial, sans-serif;
  font-size: 24px;
  color: #000;
  font-weight: 900;
  user-select: none;
}
.nav ul {
  list-style: none;
  display: flex;
  gap: 25px;
  margin: 0;
  padding: 0;
  align-items: center;
}
.nav ul li {
  position: relative;
  font-weight: 600;
  cursor: pointer;
}
.nav ul li a {
  text-decoration: none;
  color: #333;
  transition: color 0.3s;
}
.nav ul li a:hover {
  color: #007bff;
}
.dropdown:hover .dropdown-menu {
  display: block;
}
.dropdown-menu {
  position: absolute;
  top: 110%;
  left: 0;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0 6px 12px rgb(0 0 0 / 0.1);
  border-radius: 6px;
  display: none;
  min-width: 140px;
  z-index: 200;
}
.dropdown-menu li {
  padding: 8px 15px;
}
.dropdown-menu li a {
  display: block;
  color: #333;
}
.dropdown-menu li a:hover {
  background: #f0f0f0;
}

/* Contact info */
.contact-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #333;
}
.phone-icon {
  font-size: 18px;
}
.profile-pic {
  border-radius: 50%;
  width: 32px;
  height: 32px;
  object-fit: cover;
}

/* Main content area */
.main-content {
  margin: 40px auto;
  max-width: 1100px;
  background: #f9fbfd;
  border-radius: 18px;
  padding: 25px;
  min-height: 600px;
  box-shadow: 0 0 20px rgb(0 0 0 / 0.05);
}
</style>