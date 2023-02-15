<template>
    <div class="mb-5">
        <div class="radio-label">
            <label class="label"><slot></slot></label>
        </div>
        <div class="radio-option">
            <ValidationProvider
                ref="provider"
                :name="fieldName"
                :rules="rules"
                v-slot="{ errors }"
            >
                <AtomRadioButton
                    @change.native="handleChange"
                    :values="values"
                    :currentSelectedRadio="currentSelectedRadio"
                ></AtomRadioButton>
                <span class="has-text-danger is-size-7">{{ errors[0] }}</span>
            </ValidationProvider>
        </div>
    </div>
</template>

<script>
import { ValidationProvider } from 'vee-validate';
import AtomRadioButton from '../atoms/AtomRadioButton.vue';
export default {
    name: 'MoleculeRadioButton',
    components: { ValidationProvider, AtomRadioButton },
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
