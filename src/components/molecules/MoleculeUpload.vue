<template>
    <div ref="provider" :name="fieldName" :rules="rules">
        <AtomUpload @uploadFiles="handleUpload" class="mb-5"></AtomUpload>
        <span class="has-text-danger is-size-7">{{ errors[0] }}</span>
    </div>
</template>

<script>
import AtomUpload from '../atoms/AtomUpload.vue';
import { getConvertedImage } from '../../includes/ConvertImageToByte';
export default {
    name: 'MoleculeUpload',
    components: { AtomUpload },
    props: {
        rules: {
            type: [Object, String],
            default: '',
        },
        fieldName: {
            type: String,
            default: 'field',
        },
    },
    methods: {
        async handleUpload(data) {
            const { valid } = await this.$refs.provider.validate(data);
            if (valid) {
                const imgArray = await getConvertedImage(data[0]);
                this.$emit('data', imgArray);
            }
        },
    },
};
</script>

<style></style>
