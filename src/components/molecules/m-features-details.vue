<template>
    <div class="m-features-details">
        <img class="m-features-details-img" :src="src" />
        <h2 class="m-features-details-title">{{ featuresTitle }}</h2>
        <br />
        <p class="m-features-details-text" v-html="featuresText"></p>
    </div>
</template>

<script>
export default {
    name: 'MFeaturesDetails',
    components: {},
    props: {
        featuresTitle: String,
        featuresText: String,
    },
    data() {
        return {
            src: require('../../assets/features-tick.svg'),
        };
    },
};
</script>

<style scoped>
.m-features-details-title {
    font-size: 2rem;
    font-weight: 600;
}

.m-features-details-img {
    max-width: 2.5rem;
}

.m-features-details-text {
    font-size: 1rem;
}
</style>
