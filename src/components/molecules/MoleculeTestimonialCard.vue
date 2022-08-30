<template>
    <div class="card">
        <div class="card-content">
            <div class="testimony">
                <div class="testimony-left">
                    <figure class="image is-48x48">
                        <img
                            class="is-rounded"
                            :src="items.image"
                            alt="Placeholder image"
                        />
                    </figure>
                </div>
                <div class="testimony-right">
                    <AtomParagraph class="testimony-name">{{
                        items.name
                    }}</AtomParagraph>
                </div>
            </div>

            <div class="quote">
                <AtomImage
                    :alt="'quote'"
                    :src="img"
                    :ratio="'1by1'"
                ></AtomImage>
            </div>

            <div class="content">
                <span class="content-text">
                    {{ items.quote }}
                </span>
                <br />
                <div class="quote-bottom">
                    <AtomRating class="rating" :rate="items.rate"></AtomRating>
                    <time :datetime="items.datetime">{{ items.date }}</time>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AtomImage from '../atoms/AtomImage.vue';
import AtomParagraph from '../atoms/AtomParagraph.vue';
import AtomRating from '../atoms/AtomRating.vue';
export default {
    name: 'MoleculeTestimonialCard',
    components: {
        AtomImage,
        AtomParagraph,
        AtomRating,
    },
    props: {
        items: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            img: require('@/assets/quote.png'),
        };
    },
};
</script>

<style scoped>
.quote {
    width: 64px;
}

.testimony {
    display: flex;
    gap: 1rem;
}

.testimony-right {
    align-self: center;
}

.testimony-name {
    font-weight: var(--semi-bold-font);
}

.quote-bottom {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
}

.rating {
    margin: 0 !important;
}

/* .content-text {
    -webkit-box-orient: vertical;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    overflow: hidden;
} */
</style>
