<template>
    <b-tooltip
        :label="label"
        type="is-warning is-light"
        position="is-top"
        multilined
    >
        <slot></slot>
    </b-tooltip>
</template>

<script>
export default {
    name: 'AtomTooltip',
    props: {
        /**
         * msg inside tooltip
         */
        label: {
            type: String,
            required: true,
        },
    },
};
</script>

<style></style>
