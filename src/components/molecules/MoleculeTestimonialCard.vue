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
$black: var(--primary-text);
$white: #fff;
$g-background-color-dark: #18181b;

.content-wrapper {
    position: relative;
    height: 500px;
    width: 100%;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    .content {
        padding: $g-spacing * 2 $g-spacing;
        color: $black;

        .quote {
            width: 64px;
            opacity: 15%;
            position: absolute;
            top: 120px;
            left: 0;
        }
        .swiper-avatar {
            display: flex;
            align-items: center;
            gap: 25px;
            margin-bottom: 20px;

            img {
                border-radius: 500px;
                height: 64px;
                width: 64px;
            }

            p {
                font-weight: 500;
                font-size: 20px;
                line-height: 24px;
                margin: 0;
            }
        }

        p {
            font-weight: 400;
            font-size: 14px;
            line-height: 24px;
            margin-bottom: 20px;
        }

        .content-bottom {
            .rating {
                font-size: 20px;
            }
        }
    }
}
</style>
