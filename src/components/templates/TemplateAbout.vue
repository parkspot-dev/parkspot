<template>
    <BodyWrapper>
        <div class="about-container">
            <AtomImage
                :src="aboutImg"
                :alt="'About Image'"
                class="about-img"
            ></AtomImage>
            <div class="about-desc" data-aos="zoom-in">
                <AtomHeading class="mb-3"> Why Choose Us? </AtomHeading>
                <AtomParagraph class="mb-2">
                    Comfortable parking experience. Brokerage free. Genuine
                    Owners. Ensured security of your vehicle. Available for
                    residents and visitors. Surveillance parking. Simple steps
                    to list property. Earn money on the go. Available on app and
                    website.
                </AtomParagraph>
                <AtomParagraph class="mb-6">
                    ParkSpot is part of this new initiative and incorporates
                    various features aimed at improving the parking experience
                    for residents and visitors. These will include removing the
                    need for entry barriers at car park entrances and exits for
                    a seamless flow of traffic, as vehicle plates will be
                    registered via cameras.
                </AtomParagraph>
                <div class="about-links-container">
                    <div class="about-links">
                        <p class="park-link">Get ParkSpot App</p>
                        <div class="app-links">
                            <span>
                                <a
                                    href="https://play.google.com/store/apps/details?id=com.parkspot.maya_nagri&utm_source=parkspot.in&utm_campaign=website"
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
                                <a
                                    href="https://apps.apple.com/in/app/parkspot-find-book-parking/id6449634064"
                                    target="_blank"
                                >
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
        gap: 10px;
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
