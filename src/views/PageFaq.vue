<template>
      <div>
            <div class="bg-decor"></div>
            <TemplateFaq></TemplateFaq>
      </div>
</template>

<script>
import TemplateFaq from "../components/templates/TemplateFaq.vue";
export default {
      name: "PageFaq",
      components: {
            TemplateFaq,
      },
};
</script>

<style scoped>
.bg-decor {
      width: 100%;
      height: 526px;
      background-color: #f7f8ff;
      -webkit-clip-path: polygon(0 0, 100% 0, 50% 100%);
      clip-path: polygon(-54% 0, 184% 0, 50% 100%);
      position: absolute;
      top: calc(0% - 7px);
      left: 0;
}
</style>
