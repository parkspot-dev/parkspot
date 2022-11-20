<template>
    <ExampleComponent></ExampleComponent>
    <!-- <div>
        <h1>Sign Up</h1>
    </div> -->
</template>
<script>
import ExampleComponent from './ExampleComponent.vue';
export default {
    /**
     * This page is used for development testing purposes.
     */
    name: 'PageTemp',
    components: {
        ExampleComponent,
    },

    data() {
        return {
            messages: ['a', 'b', 'c'],
        };
    },

    methods: {
        increment() {
            this.count++;
        },
    },
};
</script>

<style scoped>
.custom-wrapper {
    margin: auto;
    max-width: 960px;
}
</style>
