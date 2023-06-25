<template>
    <div v-show="isLoading" class="ghost-container">
        <b-loading
            :is-full-page="isFullPage"
            :active="isLoading"
            :can-cancel="false"
        ></b-loading>
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
    data() {
        return {
            isFullPage: true,
        };
    },
};
</script>

<style lang="scss">
.ghost-container {
    height: 100vh;
    background-color: #f1f1f1;
}

.body-container {
    .loading-overlay .loading-icon:after {
        border: 2px solid var(--primary-color);
        border-right-color: transparent;
        border-top-color: transparent;
    }
}
</style>
