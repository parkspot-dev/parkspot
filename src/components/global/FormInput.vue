<template>
    <div>
        <label class="label" :for="fieldname">{{ label }}</label>
        <Field
            :name="fieldname"
            :placeholder="placeholder"
            :type="type"
            class="input"
            v-bind="$attrs"
            v-model="inputValue"
        />
        <ErrorMessage :name="fieldname" class="error" />
    </div>
</template>

<script>
import { Field, ErrorMessage, useField } from 'vee-validate';

export default {
    name: 'FormInput',
    components: {
        Field,
        ErrorMessage,
    },
    props: {
        fieldname: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            default: 'text',
        },
        placeholder: {
            type: String,
            default: '',
        },
        modelValue: {
            type: String,
            default: '',
        },
    },
    setup(props) {
        const { errorMessage, value } = useField(props.fieldname);
        return { errorMessage, value };
    },
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
};
</script>

<style>
.error {
    color: red;
    font-size: 12px !important;
}
.label {
    font-size: 14px !important;
    font-weight: 500 !important;
    margin-top: 8px;
}
.input {
    padding: 8px;
    width: 100%;
}
</style>
