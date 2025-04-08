<template>
    <div class="select-wrapper">
        <label v-if="label" :for="name" class="label">{{ label }}</label>
        <select v-model="selectedValue" :id="name">
            <option v-for="option in list" :key="option" :value="option">
                {{ option }}
            </option>
        </select>
    </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';

const props = defineProps({
    label: { type: String, required: false },
    list: { type: Array, required: true },
    name: { type: String, required: true },
    modelValue: { type: [String, Number], required: false },
    defaultValue: { type: [String, Number], required: false },
});

const selectedValue = ref(
    props.modelValue ||
        props.defaultValue ||
        (props.list.length ? props.list[0] : ''),
);
</script>

<style scoped>
.select-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-top: -4px;
}
select {
    border-color: gainsboro;
    border-radius: 4px;
    font-size: 16px;
    outline: none;
    padding: 0.4rem;
}
.label {
    font-size: 14px !important;
    font-weight: 500 !important;
}
</style>
