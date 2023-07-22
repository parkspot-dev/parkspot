<template>
    <ValidationProvider
        ref="provider"
        :name="fieldName"
        :rules="rules"
        v-slot="{ errors }"
        class="custom-wrapper"
    >
        <label class="label"><slot></slot></label>
        <AtomCheckbox
            v-model="checkboxData"
            :values="values"
            class="mb-5"
        ></AtomCheckbox>
        <slot name="extra"></slot>
        <span class="has-text-danger is-size-7">{{ errors[0] }}</span>
    </ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate';
import AtomCheckbox from '../atoms/AtomCheckbox.vue';
export default {
    name: 'MoleculeCheckBox',
    components: {
        ValidationProvider,
        AtomCheckbox,
    },
    props: {
        rules: {
            type: [Object, String],
            default: '',
        },
        fieldName: {
            type: String,
            required: true,
        },
        values: {
            type: Array,
        },
    },
    emits: ['data'],
    data() {
        return {
            checkboxData: [],
        };
    },
    watch: {
        // Handles internal model changes.
        async checkboxData(newVal) {
            const { valid } = await this.$refs.provider.validate(newVal);
            if (valid) {
                this.$emit('input', newVal);
            }
        },
        // Handles external model changes.
        value(newVal) {
            this.checkboxData = newVal;
        },
    },
};
</script>

<style scoped>
.custom-wrapper {
    position: relative;
}
</style>
