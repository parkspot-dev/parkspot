<template>
    <section class="section">
        <TemplateFeature></TemplateFeature>
    </section>
</template>

<script>
import TemplateFeature from '../components/templates/TemplateFeature.vue';
import { PAGE_TITLE } from '@/constant/constant';
export default {
    /**
     * note: This page will be redeveloped soon
     */
    name: 'PageFeatures',
    components: { TemplateFeature },
    metaInfo() {
        return {
            title: PAGE_TITLE.FEATURES + PAGE_TITLE.BRAND_SUFFIX,
        };
    },
};
</script>

<style scoped></style>
