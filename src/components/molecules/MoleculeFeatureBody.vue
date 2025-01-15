<template>
    <div class="card p-6 features-card">
        <img class="features-img" :src="src" />
        <h2 class="features-title">{{ featuresTitle }}</h2>
        <p
            class="features-text"
            :class="check ? 'features-text-set' : 'features-text-unset'"
            @click="checkMethod"
        >
            <slot></slot>
        </p>
    </div>
</template>

<script>
export default {
    name: 'MoleculeFeatureBody',
    components: {},
    props: {
        featuresTitle: String,
    },
    data() {
        return {
            src: '/src/assets/features-tick.svg',
            check: true,
        };
    },
    methods: {
        checkMethod() {
            this.check = !this.check;
        },
    },
};
</script>

<style lang="scss" scoped>
.features-card {
    max-height: fit-content;

    .features-title {
        margin-bottom: 1rem;
        font-size: 2rem;
        font-weight: 600;
    }

    .features-img {
        max-width: 2.5rem;
    }

    .features-text {
        -webkit-box-orient: vertical;
        /* stylelint-disable-next-line value-no-vendor-prefix */
        display: -webkit-box;
        overflow: hidden;
    }

    .features-text-set {
        -webkit-line-clamp: 6;
    }

    .features-text-unset {
        -webkit-line-clamp: unset;
    }
}
</style>
