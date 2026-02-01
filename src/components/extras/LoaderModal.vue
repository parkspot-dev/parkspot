<template>
    <div class="loader-container">
        <div class="loader"></div>
        <AtomImage class="loader-image" src="/assets/ps__logo_mini.png" alt="parkspot logo" />
    </div>
</template>

<script>
import AtomImage from '../atoms/AtomImage.vue';

export default {
    name: 'LoaderModal',
    components: {
        AtomImage,
    },
};
</script>

<style lang="scss" scoped>
.loader-container {
    align-items: center;
    background-color: rgba(0, 0, 0, 50%);
    display: flex;
    height: 100%;
    justify-content: center;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 9999;
}

.loader {
    align-items: center;
    animation: spinloader 2s linear infinite;
    border-radius: 50%;
    border: 8px solid #f3f3f3;
    border-top: 8px solid var(--primary-color);
    display: flex;
    align-items: center;
    height: 136px;
    justify-content: center;
    position: relative;
    width: 136px;
}

.loader-image {
    height: 60px;
    position: absolute;
    width: 60px;
    margin-top: -28px;
}

@keyframes spinloader {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
