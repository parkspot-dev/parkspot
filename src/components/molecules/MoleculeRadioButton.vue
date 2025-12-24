<template>
    <div class="mb-5">
        <div class="radio-label">
            <label class="label"><slot></slot></label>
        </div>
        <div ref="provider" class="radio-option">
            <AtomRadioButton
                :values="values"
                :current-selected-radio="currentSelectedRadio"
                @change.native="handleChange"
            ></AtomRadioButton>
            <span class="has-text-danger is-size-7">{{ errors[0] }}</span>
        </div>
    </div>
</template>

<script>
import AtomRadioButton from '../atoms/AtomRadioButton.vue';
export default {
    name: 'MoleculeRadioButton',
    components: { AtomRadioButton },
    props: {
        currentSelectedRadio: {
            type: String,
            required: true,
        },
        values: {
            type: Array,
            required: true,
        },
        rules: {
            type: [Object, String],
            default: '',
        },
        fieldName: {
            type: String,
            required: true,
        },
    },
    emits: ['data'],
    //   data() {
    //     return {
    //       list: ["Yes", "No"],
    //     };
    //   },
    methods: {
        async handleChange(data) {
            const { valid } = await this.$refs.provider.validate(data);
            if (valid) {
                this.$emit('data', data.target.value);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.radio-label {
    margin-bottom: 0.5em;
}
</style>
