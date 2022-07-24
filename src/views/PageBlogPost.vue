<template>
  <div>
    <TemplateBlogPost :blog="blog" :content="content"></TemplateBlogPost>
    <TemplateContactUs @contactUs="fireContact"></TemplateContactUs>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import TemplateBlogPost from "../components/templates/TemplateBlogPost.vue";
import TemplateContactUs from "../components/templates/TemplateContactUs.vue";
export default {
  name: "PageBlogPost",
  components: {
    TemplateBlogPost,
    TemplateContactUs,
  },
  data() {
    return {
      content: "",
    };
  },
  computed: {
    ...mapGetters({
      getBlogById: "blog/getBlogById",
    }),
    blog() {
      return this.getBlogById(this.$route.params.id);
    },
  },
  mounted() {
    this.getContentById(this.$route.params.id).then(
      (res) => (this.content = res)
    );
  },
  methods: {
    ...mapActions({
      getContentById: "blog/getContentById",
      onlyContact: "soportal/onlyContact",
    }),
    async fireContact() {
      try {
        this.isLoading = true;

        await this.onlyContact();

        this.$buefy.toast.open({
          message: "ParkSpot registered successfully!",
          type: "is-success",
          duration: 2000,
        });

        this.$router.push({ name: "thankYou" });
      } catch (error) {
        console.error({ error });

        this.$buefy.toast.open({
          message: `Something went wrong!`,
          type: "is-danger",
          duration: 2000,
        });

        this.$router.push({ name: "Home" });
      }
      this.isLoading = false;
    },
  },
};
</script>

<style></style>
