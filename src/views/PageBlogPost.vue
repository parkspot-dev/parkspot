<template>
    <div>
        <TemplateBlogPost :blog="blog" :content="content"></TemplateBlogPost>
        <!--
            Embed the presentational Template (not the route page).
            `PageContactUs` declares its own metaInfo() which would
            otherwise override the blog-post <title> via @unhead's
            last-wins ordering. Phase 2.5 fix.
        -->
        <TemplateContactUs @contactUs="fireContact"></TemplateContactUs>
        <LoaderModal v-if="isLoading"></LoaderModal>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import TemplateBlogPost from '../components/templates/TemplateBlogPost.vue';
import TemplateContactUs from '../components/templates/TemplateContactUs.vue';
import LoaderModal from '../components/extras/LoaderModal.vue';
import { PAGE_TITLE } from '@/constant/constant';
import { buildBlogPostMeta } from '@/utils/seo/meta.js';
import { metaPayloadToHead } from '@/utils/seo/to-head.js';
export default {
    name: 'PageBlogPost',
    components: {
        TemplateBlogPost,
        TemplateContactUs,
        LoaderModal,
    },
    // Emit full SEO metadata for every prerendered blog post: title,
    // description, canonical, og:* (with the post's `img` as og:image),
    // and a `BlogPosting` JSON-LD block. Falls back to the legacy
    // template title if the route param doesn't match a known post —
    // this can happen during SSR for slugs that no longer exist in the
    // bundled blog list, and we want a sensible default rather than a
    // crash.
    metaInfo() {
        const blog = this.blog;
        if (!blog) {
            return {
                title: this.title,
                titleTemplate: PAGE_TITLE.TITLE_TEMPLATE + '%s',
            };
        }
        const head = metaPayloadToHead(buildBlogPostMeta(blog));
        return {
            title: head.title,
            // `head.title` already includes the brand suffix, so the
            // legacy titleTemplate must not be applied on top.
            titleTemplate: undefined,
            meta: head.meta,
            link: head.link,
            script: head.script,
        };
    },
    data() {
        return {
            content: '',
            title: undefined,
            isLoading: false,
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
    serverPrefetch() {
        // SSR-only hook. Populate `title` synchronously from the
        // bundled blog list so the prerendered HTML carries the right
        // <title> and `metaInfo()` resolves a complete payload during
        // the same render pass.
        const blog = this.blog;
        this.title = blog ? blog.title : this.$route.params.id;
        // `getContentById` doesn't exist as a Vuex action today
        // (`blog/p` is a no-op — see `src/store/blog/index.js`), so
        // there is no async content fetch to await here. If a real
        // action lands later, the SSR shape can be extended to await
        // it without touching the rest of this file.
    },
    mounted() {
        // Hydration shortcut: if `serverPrefetch` already populated
        // `title`, skip the redundant client work.
        if (!this.title) {
            const blog = this.blog;
            this.title = blog ? blog.title : this.$route.params.id;
        }
        this.getContentById(this.$route.params.id).then(
            (res) => (this.content = res),
        );
    },
    methods: {
        ...mapActions({
            getContentById: 'blog/p',
            onlyContact: 'user/onlyContact',
        }),
        // Handler for the embedded `<TemplateContactUs>` widget.
        // Symmetric with the wiring in `PageHome.vue` and
        // `PageContactUs.vue` (they all wrap the same Vuex action).
        // The `isLoading` reset lives in a `finally` block so a router
        // failure in the catch arm can't leave the spinner stuck.
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
            } finally {
                this.isLoading = false;
            }
        },
    },
};
</script>

<style></style>
