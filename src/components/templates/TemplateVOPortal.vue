<template>
    <div>
        <BodyWrapper>
            <AtomHeading class="mb-5 has-text-centered">
                Fill the form to Request a Parking Spot
            </AtomHeading>
            <div class="form-section-wrapper">
                <!-- Info graphic -->
                <div class="info-graphic"></div>
                <!-- Parking request form -->
                <div class="form-wrapper">
                    <div class="request-form">
                        <div class="whatsapp-link">
                            <AtomParagraph class="custom-subtitle">
                                <span>Prefer Quick Assistance?</span>
                            </AtomParagraph>
                            <p>
                                Chat with us directly on
                                <a
                                    href="https://api.whatsapp.com/send/?phone=917488239471&text=I%27m+interested+in+car+parking.&type=phone_number&app_absent=0"
                                    target="_blank"
                                    ><AtomIcon :icon="'whatsapp'"></AtomIcon> WhatsApp
                                    </a
                                >
                                for instant support and queries.
                            </p>
                        </div>
                        <div class="dividing-line">
                            <span>OR</span>
                        </div>
                        <AtomHeading
                            :level="headingLevel"
                            class="mb-5 has-text-centered"
                        >
                            Apply for Parking Service
                        </AtomHeading>
                        <ParkingRequestForm @onSubmit="onSubmit"  />
                    </div>
                </div>
            </div>
        </BodyWrapper>
        <SearchComponent />
        <TestimonialSection />
    </div>
</template>

<script>
import BodyWrapper from '../extras/BodyWrapper.vue';
import AtomHeading from '../atoms/AtomHeading.vue';
import SearchComponent from '../vo-portal/SearchComponent.vue';
import TestimonialSection from '../global/TestimonialSection.vue';
import ParkingRequestForm from '../vo-portal/ParkingRequestForm.vue';
import AtomIcon from '../atoms/AtomIcon.vue';
import AtomParagraph from '../atoms/AtomParagraph.vue';
export default {
    name: 'TemplateVOPortal',
    components: {
        BodyWrapper,
        AtomHeading,
        SearchComponent,
        TestimonialSection,
        ParkingRequestForm,
        AtomIcon,
        AtomParagraph
    },
    emits: ['finalSubmit'],
    data() {
        return {
            headingLevel: 'h5',
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
}

.dividing-line {
    border-bottom: 1px solid var(--secondary-color);
    margin-top: 0.75rem;
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
.custom-subtitle {
    text-align: center;

    span {
        background-color: #19fe4e2c;
        border-radius: 40px;
        color: var(--parkspot-green);
        font-weight: 600;
        padding: 4px 7px;
    }
}
.whatsapp-link {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;

    p > a{
        color: var(--parkspot-green);
    }
}
</style>