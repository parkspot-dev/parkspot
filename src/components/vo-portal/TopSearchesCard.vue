<template>
    <div class="card-wrapper">
        <div class="card">
            <p class="content-text-title">
                {{ item.title }}
            </p>
            <div class="button-description">
                <p class="content-text-spot">
                    {{ item.spots }}+ Premium Parking Spots Available Now!
                </p>
                <router-link :to="{ path: item.path }" class="content-btn">
                    <AtomIcon
                        class="btn-arrow"
                        @click.native="onArrowBtn"
                        :icon="'arrow-right'"
                        :size="'is-medium'"
                    ></AtomIcon>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import AtomIcon from '../atoms/AtomIcon.vue';
export default {
    name: 'TopSearchesCard',
    components: {
        AtomIcon,
    },
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
    emits: ['arrowBtn'],
    methods: {
        onArrowBtn() {
            this.$emit('arrowBtn');
        },
    },
};
</script>

<style scoped>
.card-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    justify-content: center;
    padding: 2rem;
    background-color: var(--background-color-light);
}

.card {
    background: var(--parkspot-white);
    border-radius: var(--border-default);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 300px;
    overflow: hidden;
    transition: 0.3s ease;
    cursor: pointer;
    padding: 1rem;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
}

.content-text-title {
    font-weight: var(--bold-font);
    margin-bottom: 1rem;
}

.content-text-spot {
    font-size: 0.75rem;
}

.content-btn {
    display: flex;
    justify-content: flex-end;
    margin-top: auto;
}

.btn-arrow {
    color: var(--parkspot-black);
    cursor: pointer;
}

.btn-arrow:hover {
    color: var(--primary-color);
}

.button-description {
    display: flex;
    gap: 20px;
    justify-content: space-between;
}
</style>

