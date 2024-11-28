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
        :class="{'btn-border-radius': withSearch}"
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
        withSearch: {
            type: Boolean,
            default: false
        }
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

.btn-wrapper.btn-border-radius{
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}
</style>
