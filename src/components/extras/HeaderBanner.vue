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

<style lang="scss" scoped>
.custom-banner {
    background: url('../../assets/discover-banner.svg');
    min-height: 200px;
}
</style>
