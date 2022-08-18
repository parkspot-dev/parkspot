<template>
    <div class="custom-banner">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'HeaderBanner',
};
</script>

<style scoped>
.custom-banner {
    background: url('../../assets/discover-banner.svg');
    height: 35vh;
    max-height: 300px;
    padding: 6rem;
}
@media only screen and (max-width: 1024px) {
    .custom-banner {
        padding: 3rem;
    }
}
</style>
