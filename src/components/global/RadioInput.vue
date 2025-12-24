<template>
    <div class="block">
        <label class="label">{{ label }}</label>
        <div>
            <b-radio
                v-for="option in values"
                :key="option"
                v-model="selectedValue"
                :native-value="option"
            >
                {{ option }}
            </b-radio>
        </div>
    </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
    name: 'RadioInput',
    props: {
        modelValue: {
            type: String,
            required: true,
        },
        values: {
            type: Array,
            required: true,
        },
        label: {
            type: String,
            default: 'Select an option:',
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const selectedValue = ref(props.modelValue);

        watch(selectedValue, (newValue) => {
            emit('update:modelValue', newValue);
        });

        return { selectedValue };
    },
});
</script>

<style lang="scss" scoped>
.label {
    margin-top: 20px;
}

.b-radio {
    display: flex;
    margin-bottom: 8px;
}
</style>
