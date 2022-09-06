<template>
    <div>
        <div class="bg-decor"></div>
        <TemplateFaq></TemplateFaq>
    </div>
</template>

<script>
import TemplateFaq from '../components/templates/TemplateFaq.vue';
export default {
    name: 'PageFaq',
    components: {
        TemplateFaq,
    },
};
</script>

<style scoped>
.bg-decor {
    background-color: #f7f8ff;
    clip-path: polygon(-54% 0, 184% 0, 50% 100%);
    height: 526px;
    left: 0;
    position: absolute;
    top: calc(0% - 7px);
    width: 100%;
}
</style>
