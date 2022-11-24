<template>
    <ExampleComponent :messages="messages"></ExampleComponent>
    <!-- <div>
        <h1>Sign Up</h1>
    </div> -->
</template>
<script>
import ExampleComponent from './ExampleComponent.vue';
import { PAGE_TITLE } from '@/constant/constant';
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
    metaInfo() {
        return {
            title: 'Developement Page',
            titleTemplate: PAGE_TITLE.TITLE_TEMPLATE + '%s',
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
