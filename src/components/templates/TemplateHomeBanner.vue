<template>
      <Wrapper class="homeBanner">
            <!-- <h1>hello</h1> -->
            <div class="banner-wrapper">
                  <div class="banner-header">
                        <h1 class="banner-title" data-aos="zoom-in">
                              Find Amazing Parking Spot Near You
                        </h1>
                        <h2 class="banner-subtitle" data-aos="zoom-in">
                              Instantly book your spot today.Trusted by many.
                        </h2>
                        <SearchInput class="banner-input"></SearchInput>
                        <div class="btn-wrapper">
                              <AtomButton
                                    class="banner-btn"
                                    @click.native="flyToSrp"
                              >
                                    Search ParkSpot
                              </AtomButton>
                        </div>
                  </div>
            </div>
      </Wrapper>
</template>

<script>
import Wrapper from "../extras/Wrapper.vue";
import SearchInput from "../extras/SearchInput.vue";
import AtomButton from "../atoms/AtomButton.vue";
export default {
      name: "TemplateHomeBanner",
      components: {
            Wrapper,
            SearchInput,
            AtomButton,
      },
      emits: ["flyToSrp"],
      methods: {
            flyToSrp() {
                  this.$emit("flyToSrp");
            },
      },
};
</script>

<style scoped>
.homeBanner {
      /* The image used */
      background-image: url("../../assets/Home-Banner.jpg");
      background-image: linear-gradient(
                  to right bottom,
                  rgba(28, 26, 18, 0.35),
                  rgba(21, 19, 13, 0.35)
            ),
            url("../../assets/Home-Banner.jpg");
      /* Full height */
      height: 100vh;
      max-height: 1000px;
      /* Center and scale the image nicely */
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
}

.banner-wrapper {
      max-width: 960px;
      margin: 10rem auto;
}

.banner-header {
      margin: 0 auto;
      padding: 2rem 6rem;
      color: white;
}

.banner-title {
      font-size: 3rem;
      font-weight: var(--semi-bold-font);
      line-height: var(--lh-small);
      margin-bottom: 1.25rem;
}

.banner-subtitle {
      margin-bottom: 3rem;
}
.banner-input {
      margin-bottom: 1.25rem;
}
.btn-wrapper {
      text-align: center;
}

@media only screen and (max-width: 800px) {
      .banner-header {
            padding: 0 3rem;
      }

      .banner-title {
            font-size: 2.25rem;
            text-align: center;
      }
      .banner-subtitle {
            text-align: center;
      }
}
</style>
