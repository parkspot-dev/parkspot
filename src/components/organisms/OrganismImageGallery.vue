<template>
    <div class="gallery-container">
        <div id="lightgallery">
            <template v-for="(image, i) in spotImage">
                <a
                    :key="i"
                    class="gallery-item"
                    :class="imageSize"
                    :href="image"
                    :data-sub-html="`<h4>Photo by - <a href='https://www.parkspot.in' >Parkspot </a></h4><p> Location - ${locationName}</p>`"
                >
                    <img class="img-responsive" :src="image" />
                </a>
            </template>
        </div>
    </div>
</template>

<script>
import 'lightgallery.js';
import 'lightgallery.js/dist/css/lightgallery.css';
import { mapState } from 'vuex';

export default {
    name: 'ImageGallery',
    data() {
        return {
            imageSize: '',
            spotImage: [
                'https://parkspot.blob.core.windows.net/assets/default.png',
            ],
        };
    },
    computed: {
        ...mapState('sdp', {
            images: (state) => state.images,
            thumbnail: (state) => state.thumbnail,
            selectedSpot: (state) => state.selectedSpot,
        }),
        locationName() {
            return this.selectedSpot[0]['Name'];
        },
    },
    mounted() {
        const el = document.getElementById('lightgallery');
        window.lightGallery(el, {
            thumbnail: true,
        });

        if (this.images.length > 0) {
            this.spotImage = this.images;
        } else {
            this.spotImage = this.thumbnail;
        }

        this.setImageSize();
    },
    watch: {
        images() {
            if (this.images.length > 0) {
                this.spotImage = this.images;
            } else {
                this.spotImage = this.thumbnail;
            }
            this.setImageSize();
        },
    },

    methods: {
        setImageSize() {
            switch (this.spotImage.length) {
                case 1:
                    this.imageSize = 'image-one';
                    break;
                case 2:
                    this.imageSize = 'image-two';
                    break;
                case 3:
                    this.imageSize = 'image-three';
                    break;
                case 4:
                    this.imageSize = 'image-four';
                    break;
                default:
                    this.imageSize = 'image-five';
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.gallery-container {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;

    .gallery-item {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid var(--parkspot-black);
        background: rgb(87, 86, 86);
        opacity: 1;

        .img-responsive {
            width: auto;
            height: 100%;
            background: var(--parkspot-white);
        }
    }

    .image-one {
        top: 0;
        left: 0;
        width: 100%;
        height: 400px;
    }

    .image-two {
        &:nth-child(1) {
            top: 0;
            left: 0;
            width: 660px;
            height: 400px;
        }

        &:nth-child(2) {
            top: 0;
            left: 675px;
            width: 667px;
            height: 400px;
        }
    }

    .image-three {
        &:nth-child(1) {
            top: 0;
            left: 0;
            width: 660px;
            height: 400px;
        }

        &:nth-child(2) {
            top: 0;
            left: 675px;
            width: 667px;
            height: 195px;
        }

        &:nth-child(3) {
            top: 205px;
            left: 675px;
            width: 667px;
            height: 195px;
        }
    }

    .image-four {
        &:nth-child(1) {
            top: 0;
            left: 0;
            width: 660px;
            height: 400px;
        }

        &:nth-child(2) {
            top: 0;
            left: 675px;
            width: 330px;
            height: 400px;
        }

        &:nth-child(3) {
            top: 0;
            left: 1013px;
            width: 330px;
            height: 195px;
        }

        &:nth-child(4) {
            top: 205px;
            left: 1013px;
            width: 330px;
            height: 195px;
        }
    }
    .image-five {
        &:nth-child(1) {
            top: 0;
            left: 0;
            width: 660px;
            height: 400px;
        }

        &:nth-child(2) {
            top: 0;
            left: 675px;
            width: 330px;
            height: 195px;
        }

        &:nth-child(3) {
            top: 205px;
            left: 675px;
            width: 330px;
            height: 195px;
        }

        &:nth-child(4) {
            top: 0;
            left: 1013px;
            width: 330px;
            height: 195px;
        }

        &:nth-child(5) {
            top: 205px;
            left: 1013px;
            width: 330px;
            height: 195px;
        }

        // it will apply to all the child from 6 includes itself
        &:nth-child(n + 6) {
            display: none;
        }
    }
}
</style>
