<template>
    <div class="custom-card">
        <AtomHeading :level="'h4'" class="mb-3">
            {{ featureHeading }}
        </AtomHeading>
        <AtomParagraph :variation="'small'">
            <slot></slot>
        </AtomParagraph>
    </div>
</template>

<script>
import AtomHeading from '../atoms/AtomHeading.vue';
import AtomParagraph from '../atoms/AtomParagraph.vue';
export default {
    name: 'MoleculeFeatureCard',
    components: {
        AtomHeading,
        AtomParagraph,
    },
    props: {
        featureHeading: {
            type: String,
        },
    },
};
</script>

<style lang="scss" scoped>
.custom-card {
    padding: 2rem 3rem;
    border: 2px dotted var(--secondary-color);
    border-style: dashed;
    border-radius: var(--border-default);
    transition: transform 0.3s ease;
}

.custom-card:hover,
.custom-card:focus {
    border: 2px solid transparent;
    color: var(--secondary-color);
    background-color: var(--primary-color);
    transform: scale(1.05);
}
</style>
