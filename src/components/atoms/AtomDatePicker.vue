<template>
    <b-field>
        <b-datepicker
            v-model="date"
            placeholder="Click to select..."
            @input="onChange"
            :size="size"
        >
        </b-datepicker>
    </b-field>
</template>

<script>
export default {
    name: 'AtomDatePicker',
    props: {
        assignedDate: {
            type: Date,
        },
        size: {
            type: String,
            default: '',
        },
    },
    emits: ['changed'],
    data() {
        return {
            date: new Date(),
        };
    },
    methods: {
        onChange(val) {
            this.$emit('changed', val);
            console.log({ 'sud:: time change': val });
        },
    },
};
</script>
