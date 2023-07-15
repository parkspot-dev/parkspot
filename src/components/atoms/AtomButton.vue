<template>
    <b-button 
        class="btn-wrapper"
        @click="onClick"
        :icon-left="left"
        :type="type"
        :icon-right="right"
        :outlined="outlined"
        :inverted="inverted"
        :expanded="expanded"
    >
        <slot></slot>
    </b-button>
</template>

<script>
export default {
    name: 'AtomButton',
    props: {
        /**
         * Type of Button
         * @values is-danger
         */
        type: {
            type: String,
            default: 'btn-color',
        },
        /**
         * icons for the button
         * Material Design icons are used
         * for more icon details https://materialdesignicons.com/
         */
        left: {
            type: String,
        },
        right: {
            type: String,
        },
        outlined: {
            type: Boolean,
            default: false,
        },
        inverted: {
            type: Boolean,
            default: false,
        },
        expanded: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['btnClick'],
    methods: {
        onClick() {
            this.$emit('btnClick');
        },
    },
};
</script>

<style>
.btn-wrapper.btn-color {
    background-color: var(--primary-color);
}
</style>
