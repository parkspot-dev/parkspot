<template>
      <Wrapper>
            <div class="custom-img-wrapper">
                  <div class="custom-img">
                        <AtomImage
                              :src="img"
                              :alt="imgName"
                              :ratio="imgRatio"
                        ></AtomImage>
                  </div>
            </div>
            <h1 class="custom-header">Oops!</h1>
            <AtomParagraph :type="'p'" class="custom-para"
                  >Something went wrong...!</AtomParagraph
            >
            <div class="custom-button">
                  <AtomButton @btnClick="homeBtn" :left="'arrow-left'">
                        Back Home
                  </AtomButton>
            </div>
            <AtomParagraph :type="'p'" class="custom-para"
                  >If you have any issues. Call +91 80929 96057
            </AtomParagraph>
      </Wrapper>
</template>

<script>
import Wrapper from "../extras/Wrapper.vue";
import AtomImage from "../atoms/AtomImage.vue";
import AtomParagraph from "../atoms/AtomParagraph.vue";
import AtomButton from "../atoms/AtomButton.vue";
export default {
      name: "TemplateError",
      components: {
            Wrapper,
            AtomImage,
            AtomParagraph,
            AtomButton,
      },
      emits: ["homeBtn"],
      data() {
            return {
                  img: require("@/assets/error.svg"),
                  imgName: "error",
                  imgRatio: "1by1",
            };
      },
      methods: {
            homeBtn() {
                  this.$emit("homeBtn");
            },
      },
};
</script>
<style scoped>
.custom-header {
      font-size: 4rem;
      font-weight: var(--semi-bold-font);
      text-align: center;
}
.custom-para {
      color: var(--grey-shade);
      text-align: center;
      margin-bottom: 2rem;
}
.custom-button {
      text-align: center;
      margin-bottom: 3rem;
}
.custom-img-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
}
.custom-img {
      width: 250px;
}
</style>
