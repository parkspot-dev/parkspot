<template>
    <b-button
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
         * @values is-warning, is-danger
         */
        type: {
            type: String,
            default: 'is-warning',
        },
        /**
         * icons for the button
         * Material Design icons are used
         * for more icon details https://materialdesignicons.com/
         */
        left: {
            type: String,
            default: ""
        },
        right: {
            type: String,
            default: ""
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

<style></style>
