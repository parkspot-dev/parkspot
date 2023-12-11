<template>
    <div class="loader-container">
        <div class="loader">
            <img src="../../assets/pstopmini.png" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'LoaderModal',
};
</script>

<style lang="scss" scoped>
.loader-container {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 50%);
}

.loader {
    width: 136px;
    height: 136px;
    border: 8px solid #f3f3f3;
    border-top: 8px solid var(--primary-color);
    border-radius: 50%;
    animation: spinloader 2s linear infinite;
}

.loader img {
    width: 120px;
    height: 120px;
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
