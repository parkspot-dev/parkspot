<template>
    <div class="select-wrapper">
        <label v-if="label" :for="name" class="label">{{ label }}</label>
        <select :id="name" v-model="selectedValue">
            <option v-for="option in list" :key="option" :value="option">
                {{ option }}
            </option>
        </select>
    </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';

const props = defineProps({
    label: { type: String, required: false, default : '' },
    list: { type: Array, required: true},
    name: { type: String, required: true },
    modelValue: { type: [String, Number], required: false, default: null },
    defaultValue: { type: [String, Number], required: false, default: null },
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
    font-size: 14px !important;
    font-weight: 500 !important;
    padding-top: 14px;
}
</style>
