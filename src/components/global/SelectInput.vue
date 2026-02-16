<template>
    <div class="select-wrapper">
        <label v-if="label" :for="name" class="label">{{ label }}</label>

        <Field
            :name="name"
            as="select"
            :model-value="modelValue"
            @update:model-value="onFieldChange"
        >
            <option
                v-for="option in list"
                :key="getKey(option)"
                :value="getValue(option)"
            >
                {{ getLabel(option) }}
            </option>
        </Field>
    </div>
</template>

<script setup>
import { Field } from 'vee-validate';

const { label, name, list, modelValue } = defineProps({
    label: { type: String, default: '' },
    name: { type: String, required: true },
    list: { type: Array, required: true },
    modelValue: { type: [String, Number], default: null },
});

function getValue(option) {
    return typeof option === 'object' ? option.value : option;
}
function getLabel(option) {
    return typeof option === 'object' ? option.label : option;
}
function getKey(option) {
    return typeof option === 'object' ? option.value : option;
}

function onFieldChange(value) {
    if (!isNaN(value)) {
        value = Number(value);
    }
}
</script>

<style scoped>
.select-wrapper {
    display: flex;
    flex-direction: column;
    margin-top: -4px;
}
select {
    border-color: gainsboro;
    border-radius: 4px;
    font-size: 14px;
    outline: none;
    padding: 0.5rem;
}
.label {
    font-size: 14px;
    font-weight: 500;
    padding-top: 14px;
}
</style>
