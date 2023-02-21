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

<script>
export default {
    name: 'AtomSelectInput',
    props: {
        /**
         * The placeholder is for user
         * what type of data is in list
         */
        placeholder: {
            type: String,
            default: 'Select anything from list',
        },
        /**
         * The list is list of data
         * @values Array of Object expecting
         * e.g. [{id:0, name:'list1'},{id:1, name:'list2'}]
         * id should start with 0
         */
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
        value: {
            type: null,
        },
        size: {
            type: String,
            default: '',
        },
    },
    emits: ['input', 'changed'],
    data() {
        return {
            innerValue: '',
        };
    },
    // methods: {
    //   onInput(value) {
    //     // value - 1 because of one extra list generated for placeholder
    //     this.$emit("input", this.list[value - 1]);
    //   },
    // },
    watch: {
        // Handles internal model changes.
        innerValue(newVal) {
            this.$emit('input', newVal);
            this.$emit('changed', newVal);
        },
        // Handles external model changes.
        value(newVal) {
            this.innerValue = newVal;
        },
    },
    created() {
        if (this.value) {
            this.innerValue = this.value;
        }
    },
};
</script>

<style></style>
