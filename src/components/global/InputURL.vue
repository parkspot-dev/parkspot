<template>
    <input
        :disabled="disabled"
        :placeholder="placeholder"
        class="full-width-input"
        id="inputURL"
        type="text"
        v-model="inputValue"
    />
</template>

<script>
export default {
    props: {
        modelValue: String,
        placeholder: String,
        label: String,
        disabled: Boolean,
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

<style scoped>
.full-width-input {
    border: 1px solid #ccc;
    box-sizing: border-box;
    min-width: 250%;
    padding: 8px 12px;
}

@media (max-width: 1200px) {
    .full-width-input {
        min-width: 150%;
    }
}
@media (max-width: 768px) {
    .full-width-input {
        min-width: 200%;
    }
}

@media (max-width: 480px) {
    .full-width-input {
        min-width: 160%;
    }
}
</style>
