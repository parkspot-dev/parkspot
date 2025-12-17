<template>
    <b-field>
        <!-- Replaced b-datepicker with VueDatePicker
        Reason: b-datepicker was causing an error related to aria-hidden -->
        <VueDatePicker
            :enable-time-picker="false"
            :format="format"
            :model-value="date"
            class="date-picker"
            placeholder="Click to select..."
            @update:model-value="onChange"
        />
    </b-field>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

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
            date: this.assignedDate ? new Date(this.assignedDate) : new Date(),
        };
    },
    methods: {
        onChange(val) {
            if (val) {
                this.date = val;
                const formattedDate = new Date(val).toISOString();
                this.$emit('changed', formattedDate);
            }
        },
        format() {
            const day = this.date.getDate();
            const month = this.date.getMonth() + 1;
            const year = this.date.getFullYear();

            return `${day}/${month}/${year}`;
        },
    },
};
</script>

<style lang="scss" scoped>
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
