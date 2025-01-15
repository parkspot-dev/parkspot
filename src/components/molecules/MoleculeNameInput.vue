<template>
    <div :name="fieldName">
        <AtomInput
            v-model="innerValue"
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
        value: {
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
