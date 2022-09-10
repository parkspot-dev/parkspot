<template>
    <ul>
        <li v-for="message in messages" :key="message">
            {{ message }}
        </li>
    </ul>
</template>

<script>
export default {
    name: 'ExampleComponent',
    props: ['messages'],
    created() {
        alert(this.messages);
    },
};
</script>