<template>
    <div>
        <div>
            <PageLogin></PageLogin>
        </div>
    </div>
</template>

<script>
import PageLogin from './PageLogin.vue';

export default {
    name: 'ExampleComponent',
    components: { PageLogin },
    props: ['messages'],
};
</script>

<style lang="scss" scoped>
</style>
