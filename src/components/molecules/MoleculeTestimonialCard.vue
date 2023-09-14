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
            <p>"{{ items.quote }}"</p>
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
            img: require('@/assets/quote.png'),
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
    position: relative;
    width: 100%;
    height: 500px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

    .content {
        padding: $g-spacing * 2 $g-spacing;
        color: var(--parkspot-black);

        .quote {
            position: absolute;
            top: 120px;
            left: 0;
            width: 64px;
            opacity: 15%;
        }

        .swiper-avatar {
            display: flex;
            align-items: center;
            gap: 25px;
            margin-bottom: 20px;

            img {
                width: 64px;
                height: 64px;
                border-radius: 500px;
            }

            p {
                margin: 0;
                font-size: 20px;
                font-weight: 500;
                line-height: 24px;
            }
        }

        p {
            /* stylelint-disable-next-line value-no-vendor-prefix */
            display: -webkit-box;
            overflow: hidden;
            margin-bottom: 20px;
            font-size: 14px;
            font-weight: 400;
            line-height: 24px;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 12;
        }

        .content-bottom {
            .rating {
                font-size: 20px;
            }
        }
    }
}
</style>
