<template>
    <div class="content-wrapper">
        <div class="content">
            <div class="swiper-avatar">
                <img :src="items.image" />
                <p>{{ items.name }}</p>
            </div>
            <div class="quote">
                <img alt="quote" :src="img" />
            </div>
            <p class="quote-text">"{{ items.quote }}"</p>
            <div class="content-bottom">
                <AtomRating
                    class="rating"
                    :rate="items.rate"
                    :size="'is-small'"
                ></AtomRating>
            </div>
        </div>
    </div>
</template>

<script>
import AtomRating from '../atoms/AtomRating.vue';
export default {
    name: 'MoleculeTestimonialCard',
    components: {
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
            img: require('../../assets/quote.png'),
        };
    },
};
</script>

<style lang="scss" scoped>
$g-line-height: 1.5 !default;
$g-spacing: $g-line-height * 1em;
$white: var(--parkspot-white);
$g-background-color-dark: #18181b;

.content-wrapper {
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    height: 500px;
    position: relative;
    width: 100%;

    .content {
        color: var(--parkspot-black);
        padding: $g-spacing * 2 $g-spacing;

        .quote {
            left: 0;
            opacity: 15%;
            position: absolute;
            top: 100px;
            width: 64px;
        }

        .swiper-avatar {
            align-items: center;
            display: flex;
            gap: 25px;
            margin-bottom: 20px;

            img {
                border-radius: 500px;
                height: 64px;
                width: 64px;
            }

            p {
                font-size: 20px;
                font-weight: 500;
                line-height: 24px;
                margin: 0;
            }
        }

        p {
            /* stylelint-disable-next-line value-no-vendor-prefix */
            display: -webkit-box;
            font-size: 14px;
            font-weight: 400;
            line-height: 24px;
            margin-bottom: 20px;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 12;
            overflow: hidden;
        }

        .quote-text {
            margin-top: 2rem;
        }

        .content-bottom {
            .rating {
                font-size: 20px;
            }
        }
    }
}
</style>
