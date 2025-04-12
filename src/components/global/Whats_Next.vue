<template>
    <div class="whats-next-wrapper">
        <AtomHeading :level="'h2'" class="heading">{{ heading }}</AtomHeading>
        <section class="features-section">
            <div
                :key="index"
                class="feature-wrapper"
                v-for="(feature, index) in steps"
            >
                <div class="feature-card">
                    <span class="material-symbols-outlined feature-icon">
                        {{ feature.icon }}
                    </span>
                    <h3 class="feature-title">{{ feature.description }}</h3>
                </div>
                <div
                    class="material-symbols-outlined arrow-icon"
                    v-if="index < steps.length - 1"
                >
                    double_arrow
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import AtomHeading from '../atoms/AtomHeading.vue';

export default {
    name: 'Whats_Next',
    components: {
        AtomHeading,
    },
    props: {
        heading: {
            type: String,
            default: 'What’s next?',
        },
        steps: {
            // expected format: [{ description: '', icon: '', title: '' }]
            type: Array,
            required: true,
        },
    },
};
</script>
<style scoped>
.arrow-icon {
    align-items: center;
    color: var(--secondary-color);
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.feature-card {
    flex: 1 1 300px;
    height: 150px;
    padding: 1.5rem 2rem;
}
.feature-icon {
    color: var(--secondary-color);
    font-size: 80px;
    height: 50px;
}
.features-section {
    align-items: center;
    display: flex;
    gap: 2rem;
    max-height: 700px;
    padding: 0 3rem 3rem 3rem;
    text-align: center;
}
.feature-title {
    color: var(--parkspot-black);
    font-weight: var(--bold-font);
    margin-bottom: 0.5rem;
}
.feature-wrapper {
    display: flex;
    gap: 2rem;
    padding: 2rem 0;
}
.heading {
    text-align: center;
    text-transform: capitalize;
}
.whats-next-wrapper {
    align-items: center;
    display: flex;
    flex-direction: column;
}

@media screen and (min-width: 769px) and (max-width: 1200px) {
    .feature-card {
        height: 200px;
        padding: 1rem 0;
    }
    .feature-icon {
        font-size: 60px;
    }
}

/* Media query for mobile screen */
@media (max-width: 768px) {
    .arrow-icon {
        transform: rotate(90deg);
    }
    .feature-card {
        align-items: center;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        justify-content: center;
        max-height: fit-content;
        max-width: 100%;
        padding: 0 0.5rem;
    }
    .features-section {
        flex-direction: column;
        gap: 1rem;
        max-height: max-content;
        padding: 3rem 1.5rem;
    }
    .feature-wrapper {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 0;
    }
}
</style>
