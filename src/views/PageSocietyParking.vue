<template>
    <div class="container-main">
        <!-- Hero Section -->
        <section class="hero">
            <div class="hero-content">
                <h1>
                    Simplify Your <span class="heighlight">Society's</span>
                    <br />
                    Parking Experience
                </h1>
                <p>
                    Smart parking management for residents, visitors & admins.
                </p>
                <button>Register Now</button>
            </div>
        </section>

        <!-- Why Choose Section -->
        <section class="why-choose">
            <h2 class="heading" >Why Choose Parkspot for Your Society?</h2>
            <div class="cards-grid">
                <div class="card">
                    <h3>Seamless Operations</h3>
                    <p>
                        Automate entry, exit, and slot allocation with real-time
                        tracking.
                    </p>
                    <button>Learn more</button>
                </div>
                <div class="card">
                    <h3>Resident-Friendly</h3>
                    <p>
                        Mobile access and hassle-free parking for all residents
                        and guests.
                    </p>
                    <button>Get started</button>
                </div>
                <div class="card">
                    <h3>Admin Control</h3>
                    <p>
                        Manage user roles, generate reports, and configure
                        society-specific rules.
                    </p>
                    <button>See features</button>
                </div>
                <div class="card">
                    <h3>Security & Monitoring</h3>
                    <p>
                        Track vehicle history, enable alerts, and integrate with
                        CCTV systems.
                    </p>
                    <button>Explore</button>
                </div>
                <div class="card">
                    <h3>Visitor Management</h3>
                    <p>
                        Pre-booking, QR codes, and smoother entry experience for
                        visitors.
                    </p>
                    <button>Know more</button>
                </div>
                <div class="card">
                    <h3>Need Custom Setup?</h3>
                    <p>
                        We customize solutions for your society’s unique needs.
                    </p>
                    <button>Contact us</button>
                </div>
            </div>
        </section>

        <!--How its works-->
        <section class="" >
            <Whats_Next :steps="WHAT_NEXT_SO" />
        </section>
    </div>
</template>

<script>
import Whats_Next from '@/components/global/Whats_Next.vue';
import { WHAT_NEXT_SO } from '@/constant/constant';
export default {
    name: 'PageSocietyParking',
    components: {
        Whats_Next
    },
    metaInfo() {
        return {
            title: 'ParkSpot - Society Parking Management',
            titleTemplate: '%s | ParkSpot',
        };
    },
    data () {
        return {
            WHAT_NEXT_SO: WHAT_NEXT_SO,
        }
    }
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

.why-choose {
  background-color: #f9f9f9;
  padding: 4rem 2rem;
  text-align: center;
}

.heading {
  font-size: 2rem;
  margin-bottom: 2rem;
}

.cards-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(3, 1fr);
  margin: 0 auto;
  max-width: 1200px;
}

.card {
  background-color: #fff;
  border-radius: 12px;
  border: 1px solid var(--primary-color);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 220px;
  padding: 1.5rem;
}

.card h3 {
  color: var(--secondary-color);
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.card p {
  flex-grow: 1;
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.card button {
  background-color: var(--secondary-color);
  border-radius: 6px;
  border: none;
  color: #fff;
  cursor: pointer;
  font-weight: 600;
  padding: 0.6rem 1.2rem;
  transition: background 0.3s;
}

.card button:hover {
  background-color: white;
  border: 1px solid var(--secondary-color);
  color: var(--secondary-color);
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

    .cards-grid{
      display: flex;
      flex-direction: column;
    }
}
</style>
