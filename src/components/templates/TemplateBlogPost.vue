<template>
    <div>
        <HeaderBanner>
            <div class="blog-header">
                <h2>Parking Blogs</h2>
                <div class="blog-nav">
                    <b-breadcrumb align="is-centered" size="is-small">
                        <b-breadcrumb-item tag="router-link" to="/">
                            Home
                        </b-breadcrumb-item>
                        <b-breadcrumb-item tag="router-link" to="/blog">
                            Blogs
                        </b-breadcrumb-item>
                        <b-breadcrumb-item tag="router-link" to="/blog" active>
                            {{ blog.title }}
                        </b-breadcrumb-item>
                    </b-breadcrumb>
                </div>
            </div>
        </HeaderBanner>

        <BodyWrapper>
            <article class="article-wrapper" data-aos="fade-up">
                <header class="mb-6">
                    <AtomHeading class="mb-2">
                        {{ blog.title }}
                    </AtomHeading>
                    <div class="custom-author">
                        <figure class="author-img image is-48x48">
                            <img
                                class="is-rounded"
                                :src="blog.author_img"
                                alt="Placeholder image"
                            />
                        </figure>
                        <!-- <AtomParagraph :variation="'small'"> &nbsp; </AtomParagraph> -->
                        <AtomParagraph class="author-name" :variation="'small'">
                            {{ blog.author }}
                        </AtomParagraph>
                        <AtomParagraph
                            class="author-timestamp"
                            :variation="'small'"
                        >
                            {{ blog.time }}
                        </AtomParagraph>
                    </div>
                </header>
                <AtomImage
                    :alt="blog.title"
                    :src="blog.img"
                    :ratio="'16by9'"
                    class="mb-4"
                ></AtomImage>
                <component :is="blog.component"></component>
            </article>
        </BodyWrapper>
    </div>
</template>

<script>
import HeaderBanner from '../extras/HeaderBanner.vue';
import AtomHeading from '../atoms/AtomHeading.vue';
import BodyWrapper from '../extras/BodyWrapper.vue';
import AtomParagraph from '../atoms/AtomParagraph.vue';
import AtomImage from '../atoms/AtomImage.vue';
import OrganismNoParkingPageDesign from '../organisms/OrganismNoParkingPageDesign';
import OrganismEliminatingTrafficPageDesign from '../organisms/OrganismEliminatingTrafficPageDesign';
import OrganismParkingChallengesPageDesign from '../organisms/OrganismParkingChallengesPageDesign';
import OrganismExtraIncomePageDesign from '../organisms/OrganismExtraIncomePageDesign';
import OrganismPerfectParkingPageDesign from '../organisms/OrganismPerfectParkingPageDesign';
import OrganismBlogBengaluruTenant from '../organisms/OrganismBlogBengaluruTenant';
import OrganismBlogSmartParkingSolutions from '../organisms/OrganismBlogSmartParkingSolutions';
import OrganismBlogParkingInMallSocieties from '../organisms/OrganismBlogParkingInMallSocieties';

export default {
    name: 'TemplateBlogPost',
    components: {
        HeaderBanner,
        AtomHeading,
        AtomParagraph,
        AtomImage,
        BodyWrapper,
        OrganismNoParkingPageDesign,
        OrganismEliminatingTrafficPageDesign,
        OrganismParkingChallengesPageDesign,
        OrganismExtraIncomePageDesign,
        OrganismPerfectParkingPageDesign,
        OrganismBlogBengaluruTenant,
        OrganismBlogSmartParkingSolutions,
        OrganismBlogParkingInMallSocieties,
    },
    props: {
        blog: {
            type: Object,
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

    h2 {
        font-size: 2rem;
        font-weight: 500;
    }
}

.article-wrapper {
    margin: auto;
    max-width: 960px;
}

.custom-author {
    column-gap: 2rem;
    display: inline-grid;
    grid-template-columns: auto auto auto;
    grid-template-rows: 1fr 1fr;
}

.author-img {
    grid-row: 1 / 4;
    margin: auto;
}

.author-timestamp {
    color: var(--grey-shade);
    grid-row: 2 / 2;
}

.author-name {
    color: var(--grey-shade);
    grid-column: 2 / 4;
}
</style>