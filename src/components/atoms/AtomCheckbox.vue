<template>
    <div class="block">
        <b-checkbox
            :key="value"
            v-for="value in values"
            v-model="checkboxGroup"
            @input="handleCheckbox"
            :native-value="value"
            :size="size"
            type="box-color"
        >
            {{ value }}
            <slot name="extra"></slot>
        </b-checkbox>
    </div>
</template>

<script>
export default {
    name: 'AtomCheckbox',
    props: {
        /**
         * list of checkbox items
         * @values Array expecting
         */
        values: {
            type: Array,
            default: null,
        },
        size: String,
    },
    data() {
        return {
            checkboxGroup: [],
        };
    },
    methods: {
        handleCheckbox() {
            this.$emit('input', this.checkboxGroup);
        },
    },
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
