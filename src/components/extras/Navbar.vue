<template>
  <header>
    <b-navbar class="has-shadow custom-navpad" fixed-top>
      <template #brand>
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <img :src="parkspotIcon" alt="parkspot icon" />
          <img :src="parkspotText" alt="parkspot text" />
        </b-navbar-item>
      </template>

      <template #end>
        <b-navbar-item tag="router-link" :to="{ name: 'Home' }">
          Home
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ name: 't-about' }">
          About
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ name: 'features' }">
          Features
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ name: 'blog' }">
          Blog
        </b-navbar-item>
        <div class="navbar-item custom-drop">
          <a aria-haspopup="true" tabindex="0" class="navbar-item anchor">
            Services
          </a>
          <div class="dropList">
            <b-navbar-item tag="router-link" :to="{ name: 'VOPortal' }">
              Request Spot
            </b-navbar-item>
            <b-navbar-item tag="router-link" :to="{ name: 'SOPortal' }">
              Register Spot
            </b-navbar-item>
          </div>
        </div>
        <b-navbar-item tag="router-link" :to="{ name: 'Faq' }">
          Faq
        </b-navbar-item>
      </template>
    </b-navbar>
  </header>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      parkspotIcon: require("@/assets/pstopmini.png"),
      parkspotText: require("@/assets/pstoptext.png"),
    };
  },
};
</script>

<style scoped>
.custom-navpad {
  padding: 0.25rem 2rem;
}
@media only screen and (max-width: 1024px) {
  .custom-navpad {
    padding: 0.25rem 0;
  }
}
.navbar-item img {
  max-height: 2rem;
}
.navbar-item:hover,
.router-link-active:hover,
.router-link-exact-active:hover {
  color: var(--secondary-color);
}

.router-link-exact-active:visited {
  color: var(--secondary-color);
}

.custom-drop::after {
  border: 3px solid var(--secondary-color);
  border-radius: 2px;
  border-right: 0;
  border-top: 0;
  content: " ";
  display: block;
  height: 0.625em;
  margin-top: -0.4375em;
  pointer-events: none;
  position: absolute;
  top: 50%;
  left: 85%;
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
  -webkit-transform-origin: center;
  transform-origin: center;
  width: 0.625em;
}
.dropList {
  width: max-content;
  position: absolute;
  top: 80%;
  background-color: white;
  box-shadow: 0 8px 8px rgb(10 10 10 / 10%), 0 0 0 1px rgb(10 10 10 / 10%);
  border: 1px solid var(--grey-shade);
  border-radius: var(--border-default);
  padding: 0.25rem 3rem 0rem 0.25rem;
  font-size: 0.85rem;
}

.custom-drop .dropList {
  display: none;
}
.custom-drop:hover .dropList {
  display: block;
}
@media only screen and (max-width: 1024px) {
  .custom-drop {
    padding: 0;
  }
  .custom-drop .dropList {
    display: block;
    position: relative;
    border: 0;
    box-shadow: none;
    font-size: 1rem;
    padding: 0;
  }
  .custom-drop .anchor {
    display: none;
  }
  .custom-drop::after {
    display: none;
  }
}
</style>
