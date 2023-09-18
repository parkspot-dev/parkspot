<template>
    <BodyWrapper>
        <div class="error-img-wrapper">
            <div class="error-img">
                <AtomImage
                    :src="img"
                    :alt="imgName"
                    :ratio="imgRatio"
                ></AtomImage>
            </div>
        </div>
        <h1 class="error-header">Oops!</h1>
        <p class="error-para">
            {{ msg }}
        </p>
        <div class="error-button">
            <AtomButton @btnClick="homeBtn" :left="'arrow-left'">
                Back Home
            </AtomButton>
        </div>
        <div class="error-para">
            <p>If you have any issues.</p>
            <p>
                <a :href="helplineRef"> {{ helplineNumber }}</a>
            </p>
        </div>
    </BodyWrapper>
</template>

<script>
import BodyWrapper from '../extras/BodyWrapper.vue';
import AtomImage from '../atoms/AtomImage.vue';
import AtomButton from '../atoms/AtomButton.vue';
export default {
    name: 'TemplateError',
    components: {
        BodyWrapper,
        AtomImage,
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
    computed: {
        ...mapState('config', ['helplineNumber', 'helplineRef']),
    },
    methods: {
        homeBtn() {
            this.$emit('homeBtn');
        },
    },
};
</script>
<style lang="scss" scoped>
.error-header {
    font-size: 4rem;
    font-weight: var(--semi-bold-font);
    text-align: center;
}

.error-para {
    margin-bottom: 2rem;
    text-align: center;
    color: var(--grey-shade);
}

.error-button {
    margin-bottom: 3rem;
    text-align: center;
}

.error-img-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
}

.error-img {
    width: 250px;
}
</style>
