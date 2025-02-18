<template>
    <div :name="fieldName">
        <AtomInput
            :modelValue="innerValue"
            @update:modelValue="innerValue = $event"
            :placeholder="placeholder"
            :type="inputType"
            :label="label"
            class="mb-1"
        >
        </AtomInput>
    </div>
</template>

<script>
import AtomInput from '../atoms/AtomInput.vue';
export default {
    name: 'MoleculeNameInput',
    components: {
        AtomInput,
    },
    props: {
        modelValue: {
            type: null,
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
            this.$emit('update:modelValue', newVal);
        },
        // Handles external model changes.
        modelValue(newVal) {
            this.innerValue = newVal;
        },
    },
    created() {
        if (this.modelValue) {
            this.innerValue = this.modelValue;
        }
    },
};
</script>

<style></style>
