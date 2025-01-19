<template>
    <b-field :label="label">
        <b-input
            :maxlength="maxlength"
            type="textarea"
            :placeholder="placeholder"
            v-model="inputValue"
            @blur="onChange($event.target.value)"
            :size="size"
            :rows="rowNo"
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
        modelValue: {
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
        /**
         * row is to decide height of the input field
         * by giving no. of rows.
         */
        rowNo: {
            type: Number,
            default: 5,
        },
    },
    emits: ['update:modelValue', 'changed'],
    computed: {
        inputValue: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit('update:modelValue', value);
            },
        },
    },
    methods: {
        onChange(value) {
            this.$emit('changed', value);
        },
    },
};
</script>

<style></style>
