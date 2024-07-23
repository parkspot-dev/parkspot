<template>
    <BodyWrapper>
        <div class="about-container">
            <AtomImage
                :src="aboutImg"
                :alt="'About Image'"
                class="about-img"
            ></AtomImage>
            <div class="about-desc" data-aos="zoom-in">
                <AtomHeading class="mb-3 ml-1">Company Overview:</AtomHeading>
                <AtomParagraph class="mb-2 ml-1 mr-1">
                    Welcome to ParkSpot, your ultimate destination for hassle-free monthly car parking solutions. At ParkSpot, our mission is to revolutionize the parking experience by providing convenient and reliable monthly car parking services. We value efficiency, reliability, and customer satisfaction above all else.
                </AtomParagraph>
                <AtomHeading class="mb-3 ml-1">Our Services:</AtomHeading>
                <AtomParagraph class="mb-2 ml-1 mr-1">
                    ParkSpot offers a range of monthly car parking services designed to meet your needs. With our user-friendly platform, finding and booking a parking spot is quick and easy. Experience the convenience and benefits of secure parking tailored to your requirements.
                </AtomParagraph>
                <AtomParagraph class="mb-2 ml-1 mr-1">
                Let's get started and <a href="/get-parking-spot">get your Parking Spot</a> or <a href="/register-parking-spot">register your Parking Spot</a> with your parking companion.
                </AtomParagraph>
                <div class="about-links-container">
                    <div class="about-links">
                        <p class="park-link">Get ParkSpot App</p>
                        <div class="app-links">
                            <span>
                                <a
                                    :href="APP_LINK.ANDROID"
                                    target="_blank"
                                >
                                    <figure class="card-img image">
                                        <img
                                            alt="google app link"
                                            :src="appLinkImg"
                                        />
                                    </figure>
                                </a>
                            </span>
                            <span>
                                <a :href="APP_LINK.IOS" target="_blank">
                                    <figure class="card-img image">
                                        <img
                                            alt="ios app link"
                                            :src="iosAppLinkImg"
                                        />
                                    </figure>
                                </a>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </BodyWrapper>
</template>

<script>
import BodyWrapper from '../extras/BodyWrapper.vue';
import AtomHeading from '../atoms/AtomHeading.vue';
import AtomParagraph from '../atoms/AtomParagraph.vue';
import AtomImage from '../atoms/AtomImage.vue';
import { APP_LINK } from '@/constant/constant';
export default {
    name: 'TemplateAbout',
    components: {
        BodyWrapper,
        AtomHeading,
        AtomParagraph,
        AtomImage,
    },
    data() {
        return {
            appLinkImg: require('@/assets/google-play-badge.svg'),
            iosAppLinkImg: require('@/assets/apple-store.svg'),
            aboutImg: require('@/assets/about.svg'),
            APP_LINK,
        };
    },
};
</script>

<style lang="scss" scoped>
.about-links {
    display: flex;
    align-items: center;
    gap: 50px;

    @media (max-width: 1024px) {
        gap: 5px;
    }
    .app-links {
        display: flex;
        gap: 8px;
        width: 300px; 
    }
}

.about-links .park-link {
    font-size: 1.5rem;
}

@media only screen and (max-width: 1024px) {
    .about-links .park-link {
        font-size: 1rem;
    }
}

.about-container {
    display: flex;
    align-items: center;
    gap: 2rem;
}

@media only screen and (max-width: 750px) {
    .about-container {
        flex-direction: column;
    }
}

.about-img {
    flex: 30%;
}

.about-desc {
    flex: 50%;
}
</style>
