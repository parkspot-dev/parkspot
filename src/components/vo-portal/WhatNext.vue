<template>
    <section class="what-next">
        <div class="content">
            <AtomHeading class="custom-subtitle" :level="'h3'"
                >What Next?</AtomHeading
            >
            <p>
                From quick responses to hassle-free parking, we make your
                journey simple and stress-free.
            </p>
        </div>
        <div class="benefits">
            <div
                v-for="(item, index) in benefits"
                :key="index"
                class="benefit-card"
            >
                <div class="icon-wrapper">
                    <span class="material-symbols-outlined">
                        {{ item.icon }}
                    </span>
                </div>
                <div class="text-content">
                    <h3>{{ item.title }}</h3>
                    <p v-if="item.description">{{ item.description }}</p>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import AtomHeading from '../atoms/AtomHeading.vue';

export default {
    components: {
        AtomHeading,
    },
    data() {
        return {
            benefits: [
                {
                    description: 'You will hear back',
                    icon: 'support_agent',
                    title: 'Step 1',
                },
                {
                    description:
                        'Schedule the visit to the spot after registration.',
                    icon: 'how_to_reg',
                    title: 'Step 2',
                },
                {
                    description: 'Pay and park',
                    icon: 'car_tag',
                    title: 'Step 3',
                },
                {
                    description: 'Relax',
                    icon: 'self_improvement',
                    title: 'Step 4',
                },
            ],
        };
    },
};
</script>

<style scoped>
.what-next {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 3rem 3rem 3rem;
}

.content {
    width: 50%;
    padding: 2rem;
}

.custom-subtitle {
    color: var(--secondary-color);
    font-weight: var(--semi-bold-font);
    text-align: start;
}

.content p {
    color: var(--parkspot-black);
    font-size: 1rem;
    line-height: 1.5;
    margin-right: 4rem;
}

.benefits {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 2rem;
    width: 50%;
}

.benefit-card {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    border-bottom: 2px solid var(--primary-color);
    padding-bottom: 1rem;
}

.benefit-card:last-child {
    border-bottom: none;
}

.icon-wrapper span {
    font-size: 3rem;
    color: var(--secondary-color);
}

.text-content h3 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
}

.text-content p {
    margin: 0.5rem 0;
    color: var(--parkspot-black);
}
</style>
