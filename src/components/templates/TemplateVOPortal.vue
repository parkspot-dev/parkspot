<template>
    <div>
        <SearchComponent />
        <BodyWrapper>
            <div class="heading-container">
                <AtomHeading class="custom-title" :level="'h2'">
                    We Would love to serve you!
                </AtomHeading>
                <p class="sub-heading">
                    Get your safe and secure hassle free parking space near you
                </p>
            </div>
            <div class="form-section-wrapper">
                <!-- Info graphic -->
                <div class="info-graphic"></div>
                <!-- Parking request form -->
                <div class="form-wrapper">
                    <div class="request-form">
                        <div class="text">
                            <div class="whatsapp-link">
                                <p>
                                    Chat with us directly on
                                    <a
                                        href="https://api.whatsapp.com/send/?phone=917488239471&text=I%27m+interested+in+car+parking.&type=phone_number&app_absent=0"
                                        target="_blank"
                                        ><AtomIcon
                                            :icon="'whatsapp'"
                                        ></AtomIcon>
                                        WhatsApp
                                    </a>
                                    for instant support.
                                </p>
                            </div>
                            <div class="dividing-line">
                                <span>OR</span>
                            </div>
                            <p class="sub-heading">Apply for Parking Service</p>
                        </div>
                        <ParkingRequestForm @onSubmit="onSubmit" />
                    </div>
                </div>
            </div>
        </BodyWrapper>
        <TestimonialSection />
    </div>
</template>

<script>
import AtomIcon from '../atoms/AtomIcon.vue';
import AtomHeading from '../atoms/AtomHeading.vue';
import BodyWrapper from '../extras/BodyWrapper.vue';
import ParkingRequestForm from '../vo-portal/ParkingRequestForm.vue';
import SearchComponent from '../vo-portal/SearchComponent.vue';
import TestimonialSection from '../global/TestimonialSection.vue';
export default {
    name: 'TemplateVOPortal',
    components: {
        AtomIcon,
        AtomHeading,
        BodyWrapper,
        ParkingRequestForm,
        SearchComponent,
        TestimonialSection,
    },
    emits: ['finalSubmit'],
    data() {
        return {
            headingLevel: 'h6',
        };
    },
    methods: {
        onSubmit() {
            this.$emit('finalSubmit'); // Emits finalSubmit event
        },
    },
};
</script>

<style lang="scss" scoped>
.card-wrapper {
    margin: 0 auto;
    max-width: 600px;
    padding: 2rem 1rem;
}

.footer-buttons {
    display: flex;
    justify-content: space-between;
}

.form-section-wrapper {
    display: flex;
    flex-direction: row;
    width: 100%;

    .info-graphic {
        width: 50%;
    }

    .form-wrapper {
        padding: 20px;
        width: 50%;
    }
}

@media (max-width: 768px) {
    .form-section-wrapper {
        flex-direction: column;

        .info-graphic {
            width: 100%;
        }

        .form-wrapper {
            padding: 10px;
            width: 100%;
        }
    }
}

.request-form {
    border-radius: var(--border-default);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 2rem 1rem;

    .text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        gap: 1rem;
    }
}

.dividing-line {
    border-bottom: 1px solid var(--secondary-color);
    position: relative;
    text-align: center;
    width: 100%;

    span {
        background-color: white;
        color: var(--parkspot-black);
        left: 50%;
        padding: 4px 5px !important;
        position: absolute;
        top: -15px;
        transform: translateX(-50%);
    }
}
.whatsapp-link {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    text-align: center;

    p {
        color: var(--parkspot-black) !important;
    }

    p > a {
        color: var(--parkspot-green);
    }
}

.heading-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
    margin-bottom: 40px;
    text-align: center;

    .custom-subtitle {
        color: var(--secondary-color);
        font-weight: var(--semi-bold-font);
        text-align: center;
    }
}

.sub-heading {
    color: var(--secondary-color);
    font-weight: var(--semi-bold-font);
    text-align: center;
}
</style>
