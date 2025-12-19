<template>
    <div ref="provider" :name="fieldName" :rules="rules" class="custom-wrapper">
        <label class="label"><slot></slot></label>
        <AtomCheckbox
            :values="values"
            class="mb-5"
            @change="handleChange"
        >
            <template #extra>
                <slot name="extra"></slot>
            </template>
        </AtomCheckbox>
        <span class="has-text-danger is-size-7">{{ errors[0] }}</span>
    </div>
</template>

<script>
import AtomCheckbox from '../atoms/AtomCheckbox.vue';
export default {
    name: 'MoleculeCheckBox',
    components: {
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
            default: () => [],
        },
    },
    emits: ['data'],
    data() {
        return {
            checkboxData: [],
        };
    },
    methods: {
        async handleChange(data) {
            const { valid } = await this.$refs.provider.validate(data);
            if (valid) {
                this.checkboxData.push(data.target.value);
                this.$emit('data', this.checkboxData);
            }
        },
    },
};
</script>

<style scoped>
.custom-wrapper {
    position: relative;
}
</style>
