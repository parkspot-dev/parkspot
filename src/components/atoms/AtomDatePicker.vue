<template>
    <b-field>
        <b-datepicker
            v-model="date"
            @input="onChange"
            placeholder="Click to select..."
            :date-formatter="istFormatter"
            :focused-date="focusedDate"
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
        focusedDate: {
            type: Date,
        },
    },
    emits: ['changed'],
    data() {
        console.log('sud: focused date', this.focusedDate);
        return {
            date:
                this.assignedDate != ''
                    ? new Date(this.assignedDate)
                    : new Date(),
        };
    },
    methods: {
        onChange(val) {
            console.log('sud:: onchange ', val);
            this.$emit('changed', val);
        },
        istFormatter(date) {
            return new Intl.DateTimeFormat('en-US', {
                timeZone: 'Asia/Kolkata',
                dateStyle: 'medium',
            }).format(date);
        },
    },
};
</script>
