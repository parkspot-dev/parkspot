<template>
    <div class="select-wrapper">
        <label :for="name" class="label" >{{ label }}</label>
        <select v-model="value" :id="name" @change="emitUpdate">
            <option value="Select an option"disabled selected >Select an option</option>
            <option v-for="option in list" :key="option.id" :value="option.name">
                {{ option.name }}
            </option>
        </select>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
</template>

<script setup>
import { useField } from 'vee-validate';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    label: { type: String, required: true },
    list: { type: Array, required: true },
    name: { type: String, required: true },
    placeholder: { type: String, default: 'Select an option' },
});

const emit = defineEmits(['update:modelValue']);

const { value, errorMessage } = useField(props.name);

const emitUpdate = () => {
    emit('update:modelValue', value.value);
};
</script>

<style scoped>
.select-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}
select {
    border-color: gainsboro;
    border-radius: 4px;
    font-size: 16px;
    outline: none;
    padding: 0.5rem;
}

.label {
    font-size: 14px !important;
    font-weight: 500 !important;
}
.error {
    color: red;
    font-size: 0.875rem;
}
</style>
