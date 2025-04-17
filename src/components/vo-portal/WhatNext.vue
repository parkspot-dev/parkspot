<template>
    <div>
        <AtomHeading :level="'h2'" class="heading">What's next?</AtomHeading>
        <section class="features-section">
            <div
                v-for="(feature, index) in features"
                :key="index"
                class="feature-wrapper"
            >
                <div class="feature-card">
                    <span class="material-symbols-outlined feature-icon">
                        {{ feature.icon }}
                    </span>
                    <h3 class="feature-title">{{ feature.description }}</h3>
                </div>
                <!-- Arrow Icon, only if not the last card -->
                <div
                    v-if="index < features.length - 1"
                    class="material-symbols-outlined arrow-icon"
                >
                    double_arrow
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import { WHAT_NEXT } from '../../constant/constant';
import AtomHeading from '../atoms/AtomHeading.vue';
export default {
    name: 'WhatNext',
    components: {
        AtomHeading,
    },
    data() {
        return {
            //    WHAT_NEXT Payload
            //    {
            //      description : String,
            //      icon : String,
            //      title : String
            //    }
            features: WHAT_NEXT,
        };
    },
};
</script>
<style scoped>
.heading {
    text-transform: capitalize;
    text-align: center;
}

.features-section {
    align-items: center;
    display: flex;
    gap: 2rem;
    max-height: 700px;
    padding: 0 3rem 3rem 3rem;
    text-align: center;
}

.feature-wrapper {
    display: flex;
    gap: 2rem;
    padding: 2rem 0;
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

.feature-title {
    color: var(--parkspot-black);
    font-weight: var(--bold-font);
    margin-bottom: 0.5rem;
}

.arrow-icon {
    align-items: center;
    color: var(--secondary-color);
    display: flex;
    flex-direction: column;
    justify-content: center;
}

/* Media query for tablet screen */

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
}
</style>
