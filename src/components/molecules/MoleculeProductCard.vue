<template>
    <div class="card-wrapper">
        <div class="card">
            <div class="card-image">
                <AtomImage
                    :alt="'image'"
                    :src="items.image"
                    :ratio="'5by4'"
                ></AtomImage>
            </div>
            <div class="custom-content-wrapper">
                <div class="custom-content">
                    <div class="content-text">
                        <p class="content-text-title">
                            {{ items.title }}
                        </p>
                        <p class="content-text-desc">
                            {{ items.desc }}
                        </p>
                    </div>
                    <div class="content-btn">
                        <AtomIcon
                            class="btn-arrow"
                            :icon="'arrow-right'"
                            :size="'is-medium'"
                            @click="onArrowBtn"
                        ></AtomIcon>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AtomImage from '../atoms/AtomImage.vue';
import AtomIcon from '../atoms/AtomIcon.vue';
export default {
    name: 'MoleculeProductCard',
    components: {
        AtomImage,
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

<style lang="scss" scoped>
.card-wrapper {
    height: 450px;
}

.custom-content-wrapper {
    position: absolute;
    top: 100%;
    left: 50%;
    display: block;
    padding: 1.5rem 2rem;
    width: 80%;
    border-radius: var(--border-default);
    background: var(--parkspot-white);
    box-shadow: 0 0 15px #000000;
    transform: translate(-50%, -50%);
}

.custom-content {
    display: flex;
    gap: 2rem;
}

.content-text {
    margin-bottom: 0.25rem;
}

.content-text-title {
    font-weight: var(--bold-font);
}

.content-text-desc {
    font-size: 0.75rem;
}

.content-btn {
    align-self: end;
}

.btn-arrow {
    cursor: pointer;
}

.btn-arrow:hover {
    color: var(--primary-color);
    cursor: pointer;
}
</style>
