<template>
    <section>
        <b-pagination
            :total="totals"
            v-model="currentPage"
            :size="'is-small'"
            :per-page="3"
            :range-before="1"
            :range-after="1"
            :simple="true"
            :order="'is-centered'"
            @change="onChange"
        >
            <template #previous="props">
                <b-pagination-button
                    :page="props.page"
                    tag="button"
                    class="pagination-btn"
                >
                    Previous
                </b-pagination-button>
            </template>

            <template #next="props">
                <b-pagination-button
                    :page="props.page"
                    tag="button"
                    class="pagination-btn"
                >
                    Next
                </b-pagination-button>
            </template>
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
.pagination-link.is-current {
    background-color: var(--secondary-color) !important;
    border-color: var(--secondary-color);
}

.pagination-btn {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    cursor: pointer;
}

.pagination-btn:visited {
    border-color: var(--primary-color);
}

.pagination-btn:hover {
    border-color: var(--primary-color);
}

.pagination-btn:active {
    border-color: var(--primary-color);
}
</style>
