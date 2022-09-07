<template>
    <ValidationProvider
        :name="fieldName"
        :rules="rules"
        v-slot="{ errors, valid }"
    >
        <AtomInput
            v-model="innerValue"
            :placeholder="placeholder"
            :type="inputType"
            :errorMessage="errors"
            :errorType="{ 'is-danger': errors[0], 'is-success': valid }"
            :label="label"
            class="mb-4"
        >
        </AtomInput>
    </ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate';
import AtomInput from '../atoms/AtomInput.vue';
export default {
    name: 'MoleculeNameInput',
    components: {
        ValidationProvider,
        AtomInput,
    },
    props: {
        value: {
            type: null,
            required: true,
        },
        placeholder: {
            type: String,
            required: true,
        },
        rules: {
            type: [Object, String],
            default: '',
        },
        inputType: {
            type: String,
        },
        /**
         * Name of the input field required
         * to display correct error message
         */
        fieldName: {
            type: String,
            required: true,
        },
        label: {
            type: String,
        },
    },
    data() {
        return {
            innerValue: '',
        };
    },
    watch: {
        // Handles internal model changes.
        innerValue(newVal) {
            this.$emit('input', newVal);
        },
        // Handles external model changes.
        value(newVal) {
            this.innerValue = newVal;
        },
    },
    created() {
        if (this.value) {
            this.innerValue = this.value;
        }
    },
};
</script>

<style></style>
