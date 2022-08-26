<template>
  <footer class="custom-footer">
    <section class="primary-footer">
      <Wrapper>
        <section class="primary-footerContainer">
          <div class="custom-parkspot">
            <div class="mb-2">
              <router-link class="topSearch-link" :to="{ name: 'Home' }">
                <figure class="image parkspot-logo">
                  <img :src="psfooterImg" :alt="'parkspot footer logo'" />
                </figure>
              </router-link>
            </div>
            <AtomParagraph class="pl-4 mb-5">
              We provide the cheap and best parking spot in India. You can't
              park cheaper!
            </AtomParagraph>
            <span class="pl-2">
              <a
                href="https://play.google.com/store/apps/details?id=com.parkspot.maya_nagri&utm_source=parkspot.in&utm_campaign=website"
                target="_blank"
              >
                <figure class="card-img image is-128x128">
                  <img alt="parking spot link" :src="appLinkImg" />
                </figure>
              </a>
            </span>
          </div>

          <div class="topSearch">
            <AtomParagraph :variation="'large'" class="footer-heading">
              Top Searched Places
            </AtomParagraph>
            <div>
              <p>
                <router-link
                  class="topSearch-link"
                  :to="{
                    path: '/bangalore/parking-near-jp-nagar',
                  }"
                >
                  Parking Spot in JP-Nagar
                </router-link>
              </p>
              <p>
                <router-link
                  class="topSearch-link"
                  :to="{
                    path: '/bangalore/parking-near-btm',
                  }"
                >
                  Parking Spot in BTM
                </router-link>
              </p>
              <p>
                <router-link
                  class="topSearch-link"
                  :to="{
                    path: '/bangalore/parking-near-bommanahalli',
                  }"
                >
                  Parking Spot in Bommanahalli
                </router-link>
              </p>
              <p>
                <router-link
                  class="topSearch-link"
                  :to="{
                    path: '/bangalore/parking-near-rajajinagar',
                  }"
                  >Parking Spot in Rajajinagar</router-link
                >
              </p>
              <p>
                <router-link
                  class="topSearch-link"
                  :to="{
                    path: '/bangalore/parking-near-banashankari',
                  }"
                >
                  Parking Spot in Banashankari
                </router-link>
              </p>
              <p>
                <router-link
                  class="topSearch-link"
                  :to="{
                    path: '/bangalore/parking-near-marathahalli',
                  }"
                >
                  Parking Spot in marathahalli
                </router-link>
              </p>
            </div>
          </div>

          <div class="contact-info">
            <AtomParagraph :variation="'large'" class="footer-heading">
              Contact Info
            </AtomParagraph>
            <div class="mb-4">
              <AtomParagraph class="mb-2">
                Corporate Office Address :
              </AtomParagraph>
              <span>
                <AtomIcon
                  class="location-icon"
                  :icon="'map-marker-radius'"
                  :size="'is-medium'"
                >
                </AtomIcon>
              </span>
              <AtomParagraph :type="'span'">
                2nd Floor, Nextcoworks BTM Layout, BTM 2nd Stage, Bengaluru,
                Karnataka 560076
              </AtomParagraph>
            </div>
            <div>
              <AtomParagraph class="mb-2"> Customer Service: </AtomParagraph>
              <span>
                <a href="tel:+918092996057" class="phone-contact">
                  <AtomIcon :icon="'phone-classic'" :size="'is-medium'">
                  </AtomIcon>
                </a>
              </span>
              <AtomParagraph :type="'span'"> +91 80929 96057 </AtomParagraph>
            </div>
          </div>

          <div class="footer-discovery">
            <AtomParagraph :variation="'large'" class="footer-heading">
              Discover
            </AtomParagraph>
            <div class="footer-discoveryList">
              <ul>
                <li>
                  <p>
                    <router-link
                      class="topSearch-link"
                      :to="{
                        name: 'features',
                      }"
                    >
                      Features
                    </router-link>
                  </p>
                </li>
                <li>
                  <p>
                    <router-link
                      class="topSearch-link"
                      :to="{
                        name: 'blog',
                      }"
                    >
                      Blogs
                    </router-link>
                  </p>
                </li>
                <li>
                  <p>
                    <router-link
                      class="topSearch-link"
                      :to="{
                        name: 'VOPortal',
                      }"
                    >
                      Request Spot
                    </router-link>
                  </p>
                </li>
                <li>
                  <p>
                    <router-link
                      class="topSearch-link"
                      :to="{
                        name: 'SOPortal',
                      }"
                    >
                      Register Spot
                    </router-link>
                  </p>
                </li>
                <li>
                  <p>
                    <router-link
                      class="topSearch-link"
                      :to="{
                        name: 'Faq',
                      }"
                    >
                      Faq
                    </router-link>
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </Wrapper>
    </section>

    <section class="secondary-footer">
      <Wrapper>
        <section class="secondary-footerContainer">
          <div>
            <AtomParagraph>
              © 2021 NeoSpot Pvt Ltd.- ALL RIGHTS RESERVED
            </AtomParagraph>
            <AtomParagraph>
              <a
                href="https://www.parkspot.in/terms-and-conditions"
                target="_blank"
              >
                Terms & Conditions
              </a>
            </AtomParagraph>
          </div>
          <div class="social-groups">
            <a
              class="social-icon"
              href="https://www.facebook.com/parkspot.in"
              target="_blank"
            >
              <AtomIcon :icon="'facebook'" :size="'is-medium'"> </AtomIcon>
            </a>
            <a
              class="social-icon"
              href="https://www.instagram.com/parkspot.in/"
              target="_blank"
            >
              <AtomIcon :icon="'instagram'" :size="'is-medium'"></AtomIcon>
            </a>
            <a
              class="social-icon"
              href="https://www.linkedin.com/company/parkspot-in/"
              target="_blank"
            >
              <AtomIcon :icon="'linkedin'" :size="'is-medium'"> </AtomIcon>
            </a>
          </div>
        </section>
      </Wrapper>
    </section>
  </footer>
</template>

<script>
import Wrapper from "../extras/Wrapper.vue";
import AtomParagraph from "../atoms/AtomParagraph.vue";
import AtomIcon from "../atoms/AtomIcon.vue";
// import AtomImage from "../atoms/AtomImage.vue";
export default {
  name: "TemplateFooter",
  components: {
    Wrapper,
    AtomParagraph,
    AtomIcon,
    // AtomImage,
  },
  data() {
    return {
      psfooterImg: require("@/assets/psfooterlogo.png"),
      appLinkImg: require("@/assets/google-play-badge.png"),
    };
  },
};
</script>

<style scoped>
.parkspot-logo {
  width: 250px;
}
.custom-footer,
.topSearch-link {
  color: #888d93;
}
.topSearch-link:hover {
  color: var(--primary-color);
}

.primary-footer {
  background-color: #1f2e3b;
}
.secondary-footer {
  background-color: #162029;
}
.footer-heading {
  color: white;
  margin-bottom: 1rem;
}
.primary-footerContainer {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}
@media only screen and (max-width: 600px) {
  .primary-footerContainer {
    flex-direction: column;
  }
}
.custom-parkspot {
  display: flex;
  flex-direction: column;
  flex: 22%;
}
.contact-info {
  flex: 25%;
}
.topSearch {
  flex: 25%;
}

.footer-discovery {
  flex: 20%;
}
.secondary-footerContainer {
  display: flex;
  justify-content: space-between;
}
.social-groups {
}
.social-icon {
  color: var(--primary-text);
  padding: 0.5rem;
}
.social-icon:hover {
  color: var(--primary-color);
}
.footer-discoveryList ul {
  padding-left: 1rem;
}
.footer-discoveryList li {
  position: relative;
}
.footer-discoveryList ul li::before {
  content: "\2022";
  color: var(--primary-color);
  position: absolute;
  font-size: 25px;
  left: -19px;
  top: -7px;
}
.location-icon {
  color: var(--primary-color);
}
.phone-contact {
  color: var(--secondary-color);
  cursor: pointer;
}
.phone-contact:hover {
  color: var(--primary-color);
}
</style>
