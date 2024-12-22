<template>
    <b-field>
        <b-datepicker
            :date-formatter="istFormatter"
            :size="size"
            @input="onChange"
            class="date-picker"
            placeholder="Click to select..."
            v-model="date"
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
                dateStyle: 'medium',
            }).format(date);
        },
    },
};
</script>

<style lang="scss">
$datepicker-today-border: 1px solid gray;
.date-picker {
    border: $datepicker-today-border;
    padding: 0;
}

.input {
    border: none;
    outline: none;

    &:focus {
        background-color: white !important;
        border: none !important;
        box-shadow: none !important;
        outline: none !important;
    }
}
</style>
