<template>
    <div class="select-wrapper">
        <label :for="name" class="label">{{ label }}</label>
        <select v-model="value" :id="name" @change="emitUpdate" :size="size">
            <option value="" disabled selected>{{ placeholder }}</option>
            <option
                :key="option.id"
                :value="option.name"
                v-for="option in list"
            >
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
    size: { type: Number, default: 1 },
    placeholder: { type: String, default: 'Select an option' },
});

const emit = defineEmits(['update:modelValue']);

const { value, errorMessage } = useField(props.name);

// Set list first value as default select option
const defaultValue = props.list.length ? props.list[0].name : '';
value.value = defaultValue;
// Set placeholder as default if no value selected initially.
if (!value.value) {
    value.value = ''; // or null if you prefer
}

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
    border-radius: 1px;
    /* font-size: 16px; */
    outline: none;
    padding: 0.4rem;
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
