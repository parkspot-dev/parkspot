<template>
    <b-icon :icon="icon" :size="size" :type="type"> </b-icon>
</template>

<script>
export default {
    name: 'AtomIcon',
    props: {
        /**
         * Material Design icons are used
         * for more icon details https://materialdesignicons.com/
         * icon name
         */
        icon: {
            type: String,
            required: true,
        },
        /**
         * icon size
         * @values is-small, is-medium, is-large
         */
        size: {
            type: String,
            default: 'is-small',
        },
        /**
         * color of icon
         * @values (primary), is-info(secondary)
         */
        type: {
            type: String,
            default: 'primary',
        },
    },
};
</script>

<style></style>
