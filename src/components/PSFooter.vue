 <template >
  <footer class="psfooter">
    <div class="footer__main">
      <div class="footer__brand">
        <h2 class="psfooter__title">ParkSpot</h2>
        <p class="psfooter__subtitle">Get The Spot</p>
      </div>

      <div class="psfooter__social">
        <p class="psfooter__social-title">Follow Us</p>
        <div class="psfooter__social-icons">
          <a
            href="https://play.google.com/store/apps/details?id=com.parkspot.maya_nagri"
            class="psfooter__social-icon"
          >
            <i class="bx bxl-play-store"></i>
          </a>
          <a
            href="https://www.linkedin.com/company/parkspot-in"
            class="psfooter__social-icon"
          >
            <i class="bx bxl-linkedin-square"></i>
          </a>
          <a
            href="https://facebook.com/parkspot.in"
            class="psfooter__social-icon"
          >
            <i class="bx bxl-facebook-square"></i>
          </a>
        </div>
      </div>
    </div>
    <div class="psfooter__copyrights">
      <p>© 2020 The Thought Engine - ALL RIGHTS RESERVED</p>
      <div>
        <router-link :to="{ name: 'Terms' }"> TERMS AND CONDITIONS</router-link>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  name: "PSFooter",
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Autour+One&display=swap");
* {
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}
.psfooter {
  background-color: #242329;
  color: #fff;
  text-align: center;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
}
.psfooter__title {
  font-size: 3rem;
  /* margin-bottom: 0.5rem; */
}
.psfooter__subtitle {
  margin-bottom: 2rem;
  font-weight: 200;
  font-family: "Autour One", cursive;
}

.psfooter__social-icons {
  display: flex;
  justify-content: space-between;
  margin-left: 5rem;
  margin-right: 5rem;
  margin-bottom: 2rem;
}

.psfooter__social-icon {
  font-size: 2rem;
  color: #fff;
  margin-bottom: 0.5rem;
}
.psfooter__social-icon:hover {
  color: #ffdd57;
}
.psfooter__copyrights {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  padding-bottom: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
  font-weight: 50;
  /* word-break: keep-all; */
}
.psfooter__copyrights::before {
  position: absolute;
  content: "";
  height: 0.005rem;
  left: 0.8rem;
  right: 0.8rem;
  background-color: #ffdd57;
}

@media screen and (min-width: 768px) {
  .footer__main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 2rem 2rem 2rem;
    padding-top: 2rem;
  }
  .psfooter__title {
    font-size: 4.5rem;
    /* margin-bottom: 0.5rem; */
  }
  .psfooter__subtitle {
    font-weight: 300;
    font-size: 1.5rem;
    font-weight: 400;
  }

  .psfooter__social-title {
    margin-bottom: 1rem;
    font-weight: 400;
  }
  .psfooter__social {
    font-size: 1.5rem;
  }

  .psfooter__social-icons {
    justify-content: space-evenly;
  }
  .psfooter__social-icon {
    font-size: 3rem;
  }
  .psfooter__copyrights {
    font-size: 1rem;
    font-weight: 200;
    padding-left: 3rem;
    padding-right: 3rem;
  }
}
</style>
