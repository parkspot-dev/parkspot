<template>
    <div class="block">
        <b-checkbox
            v-for="value in values"
            :key="value"
            v-model="checkboxGroup"
            @change="handleCheckboxChange"
            :native-value="value"
            :size="size"
            type="box-color"
        >
            {{ value }}
            <slot name="extra"></slot>
        </b-checkbox>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';

const props = defineProps({
    values: {
        type: Array,
        default: () => [],
    },
    size: String,
});

const emit = defineEmits(['input']);

const checkboxGroup = ref([]);

const handleCheckboxChange = () => {
    emit('input', checkboxGroup.value);
};
</script>

<style>
.block .b-checkbox.checkbox input[type='checkbox']:checked + .check.box-color {
    background: var(--primary-color)
        url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Cpath d='M.04.627L.146.52.43.804.323.91zm.177.177L.854.167.96.273.323.91z' fill='rgba(0,0,0,.7)'/%3E%3C/svg%3E");
    border-color: var(--secondary-color) !important;
    box-shadow: none;
}
</style>