<template>
    <section>
        <b-pagination
            :total="totals"
            v-model="currentPage"
            :size="'is-medium'"
            :per-page="3"
            :range-before="1"
            :range-after="1"
            :simple="true"
            :order="'is-centered'"
            @change="onChange"
        >
        </b-pagination>
    </section>
</template>

<script>
export default {
    name: 'PaginationBody',
    props: {
        totals: {
            type: Number,
            default: 1,
        },
        current: {
            type: Number,
            default: 1,
        },
    },
    emits: ['changed'],
    computed: {
        currentPage: {
            // getter
            get() {
                return this.current;
            },
            // setter
            set(updatedCurrent) {
                // this function needed to prevent error
                // but no functionality needed
            },
        },
    },
    methods: {
        onChange(val) {
            this.$emit('changed', val);
        },
    },
};
</script>

<style >
</style>
