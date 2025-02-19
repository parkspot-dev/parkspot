<template>
    <div class="select-wrapper">
        <label v-if="label" :for="name" class="label">{{ label }}</label>
        <select v-model="selectedValue" :id="name" @change="emitUpdate">
            <option v-for="option in list" :key="option" :value="option">
                {{ option }}
            </option>
        </select>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
    label: { type: String, required: false },
    list: { type: Array, required: true },
    name: { type: String, required: true },
    modelValue: { type: [String, Number], required: false },
    // Default value is optional
    // without it default value will be first element of list i.e. list[0]
    defaultValue: { type: [String, Number], required: false },
});

const emit = defineEmits(['update:modelValue']);

const selectedValue = ref(props.modelValue || props.defaultValue || (props.list.length ? props.list[0] : ''));

const emitUpdate = () => {
    emit('update:modelValue', selectedValue.value);
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
</style>