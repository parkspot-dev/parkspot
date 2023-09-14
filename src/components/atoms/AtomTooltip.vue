<template>
    <b-tooltip
        :label="label"
        type="tool-color is-light"
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

<style>
.b-tooltip.tool-color.tooltip-content {
    background-color: var(--primary-color);
    
}

.b-tooltip.tool-color.is-light .tooltip-content {
    background-color: #fffaeb;
    color: #946c00;
}
</style>
