<template>
    <div class="card-wrapper">
        <div class="card">
            <div class="card-image">
                <AtomImage
                    :alt="'image'"
                    :src="items.image"
                    :ratio="'5by4'"
                ></AtomImage>
                <!-- <b-tag type="is-danger" rounded style="position: absolute; top: 0">
          <b>50% OFF</b>
        </b-tag> -->
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
                            @click.native="onArrowBtn"
                            :icon="'arrow-right'"
                            :size="'is-medium'"
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

<style scoped>
.card-wrapper {
    height: 450px;
}

.custom-content-wrapper {
    background: #fff;
    border-radius: var(--border-default);
    box-shadow: 0 0 15px #000;
    display: block;
    left: 50%;
    padding: 1.5rem 2rem;
    position: absolute;
    top: 100%;
    transform: translate(-50%, -50%);
    width: 80%;
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
