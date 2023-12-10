<template>
    <b-field>
        <b-datepicker
            v-model="date"
            placeholder="Click to select..."
            :date-formatter="istFormatter"
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
            type: String,
            default: '',
        },
        size: {
            type: String,
            default: '',
        },
    },
    emits: ['changed'],
    data() {
        return {
            date:
                this.assignedDate != ''
                    ? new Date(this.assignedDate)
                    : new Date(),
        };
    },
    methods: {
        onChange(val) {
            this.$emit('changed', val);
        },
        istFormatter(date) {
            return new Intl.DateTimeFormat('en-US', {
                timeZone: 'Asia/Kolkata',
                dateStyle: 'medium'
            }).format(date);
        },
    },
};
</script>
