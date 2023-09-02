<template>
    <div>
        <div class="bg-decor"></div>
        <TemplateFaq></TemplateFaq>
    </div>
</template>

<script>
import TemplateFaq from '../components/templates/TemplateFaq.vue';
import { PAGE_TITLE } from '@/constant/constant';
export default {
    name: 'PageFaq',
    components: {
        TemplateFaq,
    },
    metaInfo() {
        return {
            title: PAGE_TITLE.FAQ,
        };
    },
};
</script>

<style lang="scss" scoped>
.bg-decor {
    position: absolute;
    top: calc(0% - 7px);
    left: 0;
    clip-path: polygon(-54% 0, 184% 0, 50% 100%);
    width: 100%;
    height: 526px;
    background-color: #f7f8ff;
}
</style>
