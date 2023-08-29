<template>
    <div class="main-heading columns">
        <div class="main-heading-text column is-one-third">
            <h1 class="title--size">
                Why Parking With ParkSpot Is
                <span class="title-second">GOOD</span>
            </h1>
            <br />
            <p class="main-heading-para">
                Finding cheap and best parking space with ease. Providing a lot
                of features that no other parking platforms provide.
            </p>
            <p class="main-heading-para">
                Navigation, Booking, Searching, Safety & Security and many
                others services at ParkSpot which makes your parking experience
                better than ever'"
            </p>
            <br />
        </div>
        <div class="main-heading-img column">
            <div class="img-wrapper">
                <div class="img-wrapper-img-width">
                    <img :src="src" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'MoleculeFeatureHeader',
    components: {},
    props: {
        featuresButton: {
            type: String,
            default() {
                return 'Contact Us';
            },
        },
        featuresButtonLink: {
            type: String,
            default() {
                return 'contactUs';
            },
        },
    },
    data() {
        return {
            src: require('../../assets/features.png'),
        };
    },
};
</script>
<style lang="scss" scoped>
.main-heading {
    background: url('../../assets/main-header-blob.svg');
    background-repeat: no-repeat;
}

.btn-shadow {
    box-shadow: 0 4px 30px -10px;
}

.img-wrapper {
    display: flex;
    justify-content: flex-end;
    width: 100%;
}

.img-wrapper-img-width {
    width: 384px;
}

@media only screen and (min-width: 1024px) {
    .img-wrapper-img-width {
        width: 680px;
    }

    .main-heading-para {
        font-size: 1.25rem;
        line-height: 28px;
    }
}

.title--size {
    font-size: 2rem;
}

.title-second {
    font-size: 1.5em;
    font-weight: 700;
    color: var(--secondary-color);
}

@media only screen and (min-width: 1024px) {
    .title--size {
        font-size: 2.5rem;
    }
}
</style>
