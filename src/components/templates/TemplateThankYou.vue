<template>
    <BodyWrapper>
        <div class="custom-img-wrapper">
            <div class="custom-img">
                <AtomImage
                    :src="img"
                    :alt="imgName"
                    :ratio="imgRatio"
                ></AtomImage>
            </div>
        </div>
        <h1 class="custom-header">Thank You, enjoy!</h1>
        <AtomParagraph :type="'p'" class="custom-para">
            {{ msg }}
        </AtomParagraph>
        <div class="custom-button">
            <AtomButton @btnClick="homeBtn" :left="'arrow-left'">
                Back Home
            </AtomButton>
        </div>
        <AtomParagraph :type="'p'" class="custom-para"
            >If you have any issues. Call <a :href="helplineRef"> {{ helplineNumber }}</a>
        </AtomParagraph>
    </BodyWrapper>
</template>

<script>
import BodyWrapper from '../extras/BodyWrapper.vue';
import AtomImage from '../atoms/AtomImage.vue';
import AtomParagraph from '../atoms/AtomParagraph.vue';
import AtomButton from '../atoms/AtomButton.vue';
import { mapState } from 'vuex';
export default {
    name: 'TemplateThankYou',
    components: {
        BodyWrapper,
        AtomImage,
        AtomParagraph,
        AtomButton,
    },
    props: {
        msg: {
            type: String,
            default: "We are happy to receive your request. Our team is diligently working on your query and will get back within 12 hours.",
        },
    },
    emits: ['homeBtn'],
    computed: {
        ...mapState('config', ['helplineNumber', 'helplineRef']),
    },
    data() {
        return {
            img: 'assets/thankyou.svg',
            imgName: 'Thank You',
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
<style lang="scss" scoped>
.custom-header {
    font-size: 4rem;
    font-weight: var(--semi-bold-font);
    text-align: center;

    @media only screen and (max-width: 400px ) {
        width: 330px;
        min-width: 300px;
        font-size: 2rem;
    }
}

.custom-para {
    margin-bottom: 2rem;
    text-align: center;
    color: var(--grey-shade);
}

.custom-button {
    margin-bottom: 3rem;
    text-align: center;
}

.custom-img-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
}

.custom-img {
    width: 250px;
}
</style>
