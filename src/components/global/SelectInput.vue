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
    defaultValue: { type: [String, Number], required: false },
    updateID: { type: Number, default: 0 }, // Index or ID to track which option is updated
});

const emit = defineEmits(['update']);

const selectedValue = ref(
    props.modelValue ||
        props.defaultValue ||
        (props.list.length ? props.list[0] : ''),
);

// Emit the updated value along with its index when selection changes
const emitUpdate = () => {
    emit('update', selectedValue.value, props.updateID);
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
