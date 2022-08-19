<template>
    <!-- <example :messages="messages"></example> -->
    <div>
        <h1>Sign Up</h1>
    </div>
</template>
<script>
// import example from "./example.vue";
export default {
    /**
     * This page is used for development testing purposes.
     */
    name: 'PageTemp',

    data: () => ({
        count: 0,
    }),

    methods: {
        increment() {
            this.count++;
        },
    },
};
</script>

<style scoped>
.custom-wrapper {
    max-width: 960px;
    margin: auto;
}
</style>
