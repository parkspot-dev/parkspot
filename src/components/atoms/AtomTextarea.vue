<template>
    <b-field :label="label">
        <b-input
            :maxlength="maxlength"
            type="textarea"
            :placeholder="placeholder"
            :value="value"
            @blur="onChange($event.target.value)"
            @input.native="onInput($event.target.value)"
            :size="size"
        ></b-input>
    </b-field>
</template>

<script>
export default {
    name: 'AtomTextarea',
    props: {
        /**
         * Textarea used for long input
         */
        label: {
            type: String,
            default: '',
        },
        maxlength: {
            type: Number,
            default: 200,
        },
        placeholder: {
            type: String,
            default: 'Message',
        },
        /**
         *  User input value in the input field
         */
        value: {
            type: String,
            default: null,
        },
        /**
         * Size is to decide
         * size of the input is-small etc.
         */
        size: {
            type: String,
            default: null,
        },
    },
    emits: ['input', 'changed'],
    methods: {
        onInput(value) {
            this.$emit('input', value);
        },
        onChange(value) {
            this.$emit('changed', value);
        },
    },
};
</script>

<style></style>
