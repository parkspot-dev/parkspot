<template>
    <div class="card-wrapper">
        <div class="card">
            <div class="custom-content-wrapper">
                <div class="custom-content">
                    <div class="content-text">
                        <p class="content-text-title">
                            {{ items.title }}
                        </p>
                    </div>
                    <router-link
                        :to="{
                            path: items.path,
                        }"
                        class="content-btn"
                    >
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
    </div>
</template>

<script>
import AtomIcon from '../atoms/AtomIcon.vue';
export default {
    name: 'MoleculeProductCard',
    components: {
        AtomIcon,
    },
    props: {
        items: {
            type: Object,
            required: true,
        },
    },
    emits: ['arrowBtn'],
    data() {
        return {};
    },
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
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 300px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
}

.custom-content-wrapper {
    padding: 1rem;
}

.custom-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
}

.content-text {
    margin-bottom: 1rem;
}

.content-text-title {
    font-size: 1.25rem;
    color: var(--parkspot-black);
    margin-bottom: 0.5rem;
}

.content-btn {
    display: flex;
    justify-content: flex-end;
    margin-top: auto;
}

.btn-arrow {
    cursor: pointer;
    color: var(--parkspot-black);
}

.btn-arrow:hover {
    color: var(--primary-color);
    cursor: pointer;
}
</style>
