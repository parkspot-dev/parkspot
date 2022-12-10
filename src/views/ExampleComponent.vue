<template>
    <div></div>
</template>

<script>
export default {
    name: 'ExampleComponent',
    props: ['messages'],
    created() {
        alert(this.messages);
    },

    mounted() {},
};
</script>

<style lang="scss" scoped>
</style>
