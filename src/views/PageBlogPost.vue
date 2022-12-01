<template>
    <div>
        <TemplateBlogPost :blog="blog" :content="content"></TemplateBlogPost>
        <PageContactUs></PageContactUs>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import TemplateBlogPost from '../components/templates/TemplateBlogPost.vue';
import PageContactUs from './PageContactUs.vue';
import { PAGE_TITLE } from '@/constant/constant';
export default {
    name: 'PageBlogPost',
    components: {
        TemplateBlogPost,
        PageContactUs,
    },
    metaInfo() {
        return {
            title: this.title,
            titleTemplate: PAGE_TITLE.TITLE_TEMPLATE + '%s',
        };
    },
    data() {
        return {
            content: '',
            title: undefined,
        };
    },
    computed: {
        ...mapGetters({
            getBlogById: 'blog/getBlogById',
        }),
        blog() {
            return this.getBlogById(this.$route.params.id);
        },
    },
    mounted() {
        this.getContentById(this.$route.params.id).then(
            (res) => (this.content = res),
        );

        console.log(this.content);
        this.title = this.$route.params.id;
    },
    methods: {
        ...mapActions({
            getContentById: 'blog/getContentById',
            onlyContact: 'user/onlyContact',
        }),
        async fireContact() {
            try {
                this.isLoading = true;

                await this.onlyContact();

                this.$buefy.toast.open({
                    message: 'ParkSpot registered successfully!',
                    type: 'is-success',
                    duration: 2000,
                });

                this.$router.push({ name: 'thankYou' });
            } catch (error) {
                console.error({ error });

                this.$buefy.toast.open({
                    message: `Something went wrong!`,
                    type: 'is-danger',
                    duration: 2000,
                });

                this.$router.push({ name: 'Home' });
            }
            this.isLoading = false;
        },
    },
};
</script>

<style></style>
