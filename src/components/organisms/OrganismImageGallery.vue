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
            image: (state) => state.image,
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

        if (this.image.length > 0) {
            this.spotImage = this.image;
        } else {
            this.spotImage = this.thumbnail;
        }

        this.setImageSize();
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

<style lang="scss" scoped >
.gallery-container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;

    .gallery-item {
        position: absolute;
        opacity: 1;
        border: 1px solid black;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgb(87, 86, 86);

        .img-responsive {
            height: 100%;
            width: auto;
            background: white;
        }
    }

    .image-one {
        width: 100%;
        height: 400px;
        top: 0;
        left: 0;
    }

    .image-two {
        &:nth-child(1) {
            width: 660px;
            height: 400px;
            top: 0;
            left: 0;
        }

        &:nth-child(2) {
            width: 667px;
            height: 400px;
            top: 0;
            left: 675px;
        }
    }

    .image-three {
        &:nth-child(1) {
            width: 660px;
            height: 400px;
            top: 0;
            left: 0;
        }

        &:nth-child(2) {
            width: 667px;
            height: 195px;
            top: 0;
            left: 675px;
        }

        &:nth-child(3) {
            width: 667px;
            height: 195px;
            top: 205px;
            left: 675px;
        }
    }

    .image-four {
        &:nth-child(1) {
            width: 660px;
            height: 400px;
            top: 0;
            left: 0;
        }

        &:nth-child(2) {
            width: 330px;
            height: 400px;
            top: 0;
            left: 675px;
        }

        &:nth-child(3) {
            width: 330px;
            height: 195px;
            top: 0;
            left: 1013px;
        }

        &:nth-child(4) {
            width: 330px;
            height: 195px;
            top: 205px;
            left: 1013px;
        }
    }
    .image-five {
        &:nth-child(1) {
            width: 660px;
            height: 400px;
            top: 0;
            left: 0;
        }

        &:nth-child(2) {
            width: 330px;
            height: 195px;
            top: 0;
            left: 675px;
        }

        &:nth-child(3) {
            width: 330px;
            height: 195px;
            top: 205px;
            left: 675px;
        }

        &:nth-child(4) {
            width: 330px;
            height: 195px;
            top: 0;
            left: 1013px;
        }

        &:nth-child(5) {
            width: 330px;
            height: 195px;
            top: 205px;
            left: 1013px;
        }

        // it will apply to all the child from 6 includes itself
        &:nth-child(n + 6) {
            display: none;
        }
    }
}
</style>