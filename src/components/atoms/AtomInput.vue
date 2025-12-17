<template>
    <component :is="wrapper">
        <b-field :label="label" :message="errorMessage" :type="errorType">
            <b-input
                :id="id"
                v-model="inputValue"
                :disabled="disabled"
                :type="type"
                :placeholder="placeholder"
                :size="size"
                @focus="onFocus($event.target.value)"
                @blur="onChange($event.target.value)"
            ></b-input>
        </b-field>
    </component>
</template>

<script>
export default {
    name: 'AtomInput',
    props: {
        /**
         * The html element name used for the wrapper.
         * @values div, section
         */
        wrapper: {
            type: String,
            default: 'div',
            validator: (value) => {
                return value.match(/(div|section)/);
            },
        },
        /**
         * The label of the input field
         */
        label: {
            type: String,
            default: null,
        },

        /**
         * Unique identifier of the form input field.
         */
        id: {
            type: String,
            default: null,
        },

        /**
         * Whether the input is disabled or not
         */
        disabled: {
            type: Boolean,
            default: false,
        },

        /**
         * The type of the form input field.
         * @values text, number, email
         */
        type: {
            type: String,
            default: 'text',
            validator: (value) => {
                return value.match(/(text|number|email)/);
            },
        },

        /**
         *  User input value in the input field
         */
        modelValue: {
            type: [String, Number],
            default: '',
        },

        /**
         * The placeholder value for the input field
         */
        placeholder: {
            type: String,
            default: null,
        },
        /**
         * Label type for validation
         * @value is-danger, is-success
         */
        errorType: {
            type: String,
            default: null,
        },
        /**
         * Label message displayed after
         * validation completed
         */
        errorMessage: {
            type: [String, Array],
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
    emits: ['update:modelValue', 'focus', 'changed'],
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
        onFocus(value) {
            this.$emit('focus', value);
        },
        onChange(value) {
            this.$emit('changed', value);
        },
    },
};
</script>

<style lang="scss">
.label {
    font-size: 14px !important;
    font-weight: 500 !important;
}
</style>
