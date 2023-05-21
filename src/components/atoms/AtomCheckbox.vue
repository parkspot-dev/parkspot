<template>
    <div class="block">
        <b-checkbox
            :key="value"
            v-for="value in values"
            v-model="checkboxGroup"
            @input="handleCheckbox"
            :native-value="value"
            :size="size"
            type="is-warning"
        >
            {{ value }}
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

<style></style>
