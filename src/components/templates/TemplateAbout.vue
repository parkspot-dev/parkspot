<template>
    <BodyWrapper>
        <div class="about-container">
            <AtomImage
                :src="aboutImg"
                :alt="'About Image'"
                class="about-img"
            ></AtomImage>
            <div class="about-desc" data-aos="zoom-in">
                <AtomHeading class="mb-3"> What is ParkSpot? </AtomHeading>
                <AtomParagraph class="mb-5">
                    We at ParkSpot strive to solve the crucial problem of
                    finding or booking available parking slots in vicinity which
                    is faced by millions of people on a daily basis. Building
                    solution to use technology for comport, security, and also
                    generate side income.
                </AtomParagraph>
                <AtomHeading class="mb-3"> Why Choose Us? </AtomHeading>
                <AtomParagraph class="mb-5">
                    Comfortable parking experience. Brokerage free. Genuine Owners. 
                    Ensured security of your vehicle. Available for residents and 
                    visitors. Surveillance parking. Simple steps to list property. 
                    Earn money on the go. Available on app and website.
                </AtomParagraph>
                <AtomParagraph class="mb-4">
                    <router-link :to="'/'" class="link">
                         Find your parking spot now!
                    </router-link>
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

.link, .router-link-active {
    color: var(--primary-text);
}

.btn {
    color: var(--primary-text);
    font-size: 1.1rem;
    font-weight: 400;
    border-radius: 50px;
    border-style: none;
}

.btn:hover {
    color: var( --secondary-color);
    cursor: pointer;
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
