<template>
    <div class="gallery-wrapper">
        <div class="gallery-container">
            <div id="lightgallery">
                <!-- Loop through displayImages and create image gallery items -->
                <template v-for="(image, index) in displayImages" :key="image">
                    <a
                        class="gallery-item"
                        :class="imageSize"
                        :href="image"
                        :data-sub-html="`<h4>Photo by - <a href='https://www.parkspot.in'>Parkspot</a></h4><p>Location - ${locationName}</p>`"
                    >
                        <button
                            v-if="removable && images && images.length > 0"
                            class="delete-btn"
                            @click.prevent.stop="removeImage(index)"
                        >
                            <AtomIcon icon="close" />
                        </button>
                        <img class="img-responsive" :src="image" />
                    </a>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import 'lightgallery.js';
import 'lightgallery.js/dist/css/lightgallery.css';
import ParkspotImage from '../../../public/assets/Parkspot_default.png';
import AtomIcon from '@/components/atoms/AtomIcon.vue';
export default {
    name: 'ImageGallery',
    components: {
        AtomIcon,
    },
    props: {
        images: {
            /**
             * images: Array of image URLs to display in the gallery.
             * Sample value:
             * [
             *   "https://example.com/image1.jpg",
             *   "https://example.com/image2.jpg",
             *   "https://example.com/image3.jpg"
             * ]
             */
            type: Array,
            default: () => [],
        },
        locationName: {
            /**
             * locationName: Name of the location to display below the image.
             * Sample value: "New York City"
             */
            type: String,
            default: '',
        },
        removable: {
            type: Boolean,
            default: true
        }
    },
    emits: ['delete-image'],
    data() {
        return {
            imageSize: '',
            displayImages: [ParkspotImage],
        };
    },
    watch: {
        images: 'updateImages',
    },
    mounted() {
        this.updateImages();
    },
    methods: {
        updateImages() {
            this.displayImages =
                this.images.length > 0 ? this.images : [ParkspotImage];
            this.setImageSize();
            this.$nextTick(() => {
                const el = document.getElementById('lightgallery');
                if (el) {
                    if (window.lgData && window.lgData[el]) {
                        window.lgData[el].destroy(true);
                    }
                    window.lightGallery(el, {
                        thumbnail: true,
                    });
                }
            });
        },
        setImageSize() {
            switch (this.displayImages.length) {
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

        removeImage(index) {
            this.$emit('delete-image', index);
        },
    },
};
</script>

<style lang="scss" scoped>
.gallery-wrapper {
    align-items: center;
    border-radius: var(--border-default);
    display: flex;
    height: 400px;
    justify-content: center;
    margin-bottom: 48px;
    margin-left: 20px;
    overflow: hidden;
    width: 100%;
    @media (max-width: 1024px) {
        flex-direction: column;
        height: auto;
        margin-left: 0%;
        padding: 16px;
    }
}

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
        @media (max-width: 1024px) {
            margin-top: 4px;
        }

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
    // === Tablet & Mobile Styles ===
    @media (max-width: 1024px) {
        .gallery-item {
            border-radius: var(--border-default);
            max-width: 100%;
            overflow: hidden;
            position: static;
            width: 100%;
        }
    }
}

.delete-btn {
    align-items: center;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 50%;
    border: none;
    color: var(--parkspot-white);
    cursor: pointer;
    display: flex;
    height: 20px;
    justify-content: center;
    padding: 8px;
    position: absolute;
    position: absolute;
    right: 16% !important;
    right: 4px;
    top: 16% !important;
    top: 4px;
    transition: background 0.1s;
    width: 20px;
}
.delete-btn:hover {
    background: rgba(255, 0, 0, 0.8);
}
</style>
