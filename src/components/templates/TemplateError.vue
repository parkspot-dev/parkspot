<template>
  <BodyWrapper>
    <div class="custom-img-wrapper">
      <div class="custom-img">
        <AtomImage :src="img" :alt="imgName" :ratio="imgRatio"></AtomImage>
      </div>
    </div>
    <h1 class="custom-header">Oops!</h1>
    <AtomParagraph :type="'p'" class="custom-para">
      {{ msg }}
    </AtomParagraph>
    <div class="custom-button">
      <AtomButton @btnClick="homeBtn" :left="'arrow-left'">
        Back Home
      </AtomButton>
    </div>
    <AtomParagraph :type="'p'" class="custom-para"
      >If you have any issues. Call +91 80929 96057
    </AtomParagraph>
  </BodyWrapper>
</template>

<script>
import BodyWrapper from '../extras/BodyWrapper.vue';
import AtomImage from '../atoms/AtomImage.vue';
import AtomParagraph from '../atoms/AtomParagraph.vue';
import AtomButton from '../atoms/AtomButton.vue';
export default {
  name: 'TemplateError',
  components: {
    BodyWrapper,
    AtomImage,
    AtomParagraph,
    AtomButton,
  },
  props: {
    msg: {
      type: String,
      default: 'Something went wrong...!',
    },
  },
  emits: ['homeBtn'],
  data() {
    return {
      img: require('@/assets/error.svg'),
      imgName: 'error',
      imgRatio: '1by1',
    };
  },
  methods: {
    homeBtn() {
      this.$emit('homeBtn');
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
  margin-bottom: 2rem;
  text-align: center;
}

.custom-button {
  margin-bottom: 3rem;
  text-align: center;
}

.custom-img-wrapper {
  align-items: center;
  display: flex;
  justify-content: center;
}

.custom-img {
  width: 250px;
}
</style>
