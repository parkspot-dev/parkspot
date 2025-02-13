<template>
    <b-field :label="label" :type="errorType" :message="errorMessage">
        <b-select
            :placeholder="placeholder"
            v-model="innerValue"
            :size="size"
            expanded
        >
            <option value="" disabled>
                {{ placeholder }}
            </option>
            <option v-for="option in list" :value="option.id" :key="option.id">
                {{ option.name }}
            </option>
        </b-select>
    </b-field>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    placeholder: {
        type: String,
        default: 'Select anything from list',
    },
    list: {
        type: Array,
        default: null,
    },
    errorMessage: {
        type: Array,
        default: null,
    },
    errorType: {
        type: Object,
        default: null,
    },
    label: {
        type: String,
    },
    modelValue: [String, Number, Object, Boolean, null],
    size: {
        type: String,
        default: null,
    },
});

const emit = defineEmits(['update:modelValue', 'change']);

const innerValue = computed({
    get() {
        return props.modelValue;
    },
    set(newValue) {
        emit('update:modelValue', newValue);
        emit('change', newValue);
    },
});
</script>
<style></style>
