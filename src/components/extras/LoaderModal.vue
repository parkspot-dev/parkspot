<template>
    <div class="loader-container" v-if="isLoading">
        <div class="loader">
            <img src="../../assets/pstopmini.png" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'LoaderModal',
    /**
     * show loading animation
     */
    props: {
        isLoading: {
            type: Boolean,
            default: false,
        },
    },
};
</script>

<style lang="scss" scoped>
.loader-container {
    height: 100vh;
    background-color: #f1f1f1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
}

.loader {
    border: 8px solid #f3f3f3;
    /* Light grey */
    border-top: 8px solid var(--primary-color);
    /* Dark Green */
    border-radius: 50%;
    width: 136px;
    height: 136px;
    animation: spinloader 2s linear infinite;
}

.loader img {
    height: 120px;
    width: 120px;
    animation: spinlogo 2s linear infinite;
}

img {
    overflow-clip-margin: content-box;
    overflow: clip;
}

@keyframes spinloader {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

@keyframes spinlogo {
    0% {
        transform: rotate(360deg);
    }

    100% {
        transform: rotate(0deg);
    }
}
</style>
