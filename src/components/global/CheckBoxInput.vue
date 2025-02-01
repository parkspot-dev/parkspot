<template>
    <div class="block">
        <b-checkbox v-model="checked" type="box-color">
            {{ label }}
            <slot name="extra"></slot>
        </b-checkbox>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
</template>

<script setup>
import { useField } from 'vee-validate';
import { defineProps, defineEmits, ref, watch } from 'vue';

const props = defineProps({
    name: { type: String, required: true },
    label: { type: String, default: 'I accept the Terms and Conditions' },
});

const emit = defineEmits(['update:modelValue', 'data']);
const { value, errorMessage } = useField(props.name);
const checked = ref(value.value || false);

watch(checked, (newVal) => {
    value.value = newVal;
    emit('updateTerms', newVal);
});
</script>

<style scoped>

.block .b-checkbox.checkbox input[type='checkbox']:checked + .check.box-color {
    background: var(--primary-color)
        url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Cpath d='M.04.627L.146.52.43.804.323.91zm.177.177L.854.167.96.273.323.91z' fill='rgba(0,0,0,.7)'/%3E%3C/svg%3E");
    border-color: var(--secondary-color) !important;
    box-shadow: none;
}
.error {
    color: red;
    font-size: 0.875rem;
}
</style>
