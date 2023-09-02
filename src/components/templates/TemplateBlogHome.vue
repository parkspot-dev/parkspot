<template>
    <div>
        <HeaderBanner>
            <div class="blog-header">
                <h1>Parking Blogs</h1>
                <div class="blog-nav">
                    <b-breadcrumb align="is-centered" size="is-small">
                        <b-breadcrumb-item tag="router-link" to="/">
                            Home
                        </b-breadcrumb-item>
                        <b-breadcrumb-item tag="router-link" to="/blog" active>
                            Blogs
                        </b-breadcrumb-item>
                    </b-breadcrumb>
                </div>
            </div>
        </HeaderBanner>

        <BodyWrapper>
            <div class="blog-container">
                <MoleculeBlogCard
                    :key="blog.id"
                    v-for="blog in blogs"
                    :blog="blog"
                    @onBtnClick="onBlogClick"
                    data-aos="zoom-in-up"
                ></MoleculeBlogCard>
            </div>
        </BodyWrapper>
    </div>
</template>

<script>
import BodyWrapper from '../extras/BodyWrapper.vue';
import HeaderBanner from '../extras/HeaderBanner.vue';
import MoleculeBlogCard from '../molecules/MoleculeBlogCard.vue';
export default {
    name: 'TemplateBlogHome',
    components: {
        BodyWrapper,
        HeaderBanner,
        MoleculeBlogCard,
    },
    props: {
        blogs: {
            type: Array,
        },
    },
    data() {
        return {};
    },
    methods: {
        onBlogClick(data) {
            this.$emit('onBlogClick', data);
        },
    },
};
</script>

<style lang="scss" scoped>
.blog-header {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    flex-direction: column;
    align-content: space-around;

    h1 {
        font-size: 2rem;
        font-weight: 500;
    }
}

.blog-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 56px;

    @media only screen and (max-width: 1024px) {
        flex-direction: column;
        align-items: center;
    }
}
</style>
