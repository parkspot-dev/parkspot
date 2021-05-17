 <template >
  <footer class="psfooter">
    <div class="footer__main">
      <div class="footer__brand">
        <div class="footer__logo">
          <div class="logo__img">
            <img :src="logo" alt="" />
          </div>
          <div>
            <h2 class="psfooter__title">ParkSpot</h2>
          </div>
        </div>
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
      <div class="psfooter__contact">
        <p class="psfooter__contact-title">Contact Us</p>
        <div class="psfooter__contact-details">
          <div class="contact1">
            <p>
            <i class="bx bx-phone-call pschange"></i>
              <span> &nbsp;+91 80929 96057</span>
            </p>
          </div>
          <div class="contact2">
            <p>
            <i class="bx bx-mail-send pschange"></i>
              <span>&nbsp;connect@parkspot.in</span>
            </p>
          </div>
          <div class="contact3">
            <p>
            <i class="bx bx-current-location pschange"></i>
              <span>&nbsp;2nd Floor, Nextcoworks BTM Layout, BTM 2nd Stage, Bengaluru, Karnataka 560076</span>
            </p>
          </div>
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
  data() {
    return {
      logo: require("@/assets/pstopmini.png"),
    };
  },
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

.psfooter__contact {
  margin: 0 5rem 2rem 5rem;
}

.psfooter__contact-title{
  font-size: 1.5rem;
  font-weight: 400;
}
.psfooter__contact-details {
  display: flex;
  flex-direction: column;
  /* justify-content: flex-start; */
  font-weight: 400;

}
.contact1,
.contact2,
.contact3 {
  align-self: center;
  /* text-align: justify; */
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
    justify-content: space-evenly;
    align-items: center;
    margin: 0 2rem 2rem 2rem;
    padding-top: 2rem;
  }
  .psfooter__title {
    font-size: 4.5rem;
    /* margin-bottom: 0.5rem; */
  }
  .footer__logo {
    display: flex;
    align-items: center;
  }

  .psfooter__subtitle {
    font-weight: 300;
    font-size: 1.5rem;
    font-weight: 400;
  }
  .footer__brand {
    display: flex;
    flex-direction: column;
    /* width: 800px; */
  }
  .logo__img {
    width: 84px;
    height: 84px;
    align-self: center;
  }
  .psfooter__social {
    width: 400px;
    align-self: center;
    margin: 0 1rem 0 5rem;
  }
  .psfooter__social-title,.psfooter__contact-title {
    margin-bottom: 1rem;
    font-weight: 400;
  }
  .psfooter__social {
    font-size: 1.5rem;
  }

  .psfooter__social-icons {
    justify-content: space-evenly;
    margin-left: 0;
    margin-right: 0;
    margin-bottom: 0;
  }
  .psfooter__social-icon {
    font-size: 3rem;
  }
  .psfooter__contact {
    width: 400px;
  }
  .psfooter__contact {
    margin: 0 1rem 0 5rem;
  }
  .contact1,
.contact2,
.contact3 {
  align-self: flex-start;
  text-align: justify;
}
  .pschange{
    float: left;
  }

  .psfooter__copyrights {
    font-size: 1rem;
    font-weight: 200;
    padding-left: 3rem;
    padding-right: 3rem;
  }
}
</style>
