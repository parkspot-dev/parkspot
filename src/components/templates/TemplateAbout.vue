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
                    We at ParkSpot strive to solve the trivial problem of
                    finding or booking available parking slots in vicinity which
                    is faced by millions of people on a daily basis. we view for
                    solutions which brings technology and life closer and
                    accessible.
                </AtomParagraph>
                <AtomParagraph class="mb-6">
                    ParkSpot is part of this new initiative and incorporates
                    various features aimed at improving the parking experience
                    for residents and visitors. These will include removing the
                    need for entry barriers at car park entrances and exits for
                    a seamless flow of traffic, as vehicle plates will be
                    registered via cameras.
                </AtomParagraph>
                <div class="about-links">
                    <AtomParagraph :variation="'large'" class="park-link">
                        Get ParkSpot App
                    </AtomParagraph>
                    <span class="pl-2">
                        <a
                            href="https://play.google.com/store/apps/details?id=com.parkspot.maya_nagri&utm_source=parkspot.in&utm_campaign=website"
                            target="_blank"
                        >
                            <figure class="card-img image">
                                <img
                                    alt="parking spot link"
                                    :src="appLinkImg"
                                />
                            </figure>
                        </a>
                    </span>
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
            appLinkImg: require('@/assets/google-play-badge.png'),
            aboutImg: require('@/assets/about.svg'),
        };
    },
};
</script>

<style scoped>
.about-links {
    align-items: center;
    display: flex;     
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
    align-items: center;
    display: flex;
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
