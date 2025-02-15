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
    min-height: 200px;
    background: url('/assets/discover-banner.svg');
}
</style>
