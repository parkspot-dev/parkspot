<template>
    <div>
        <SearchComponent />
        <BodyWrapper>
            <div class="heading-container">
                <AtomHeading :level="'h2'">
                    We Would love to serve you!
                </AtomHeading>
                <p class="sub-heading">
                    Get your safe and secure hassle free parking space near you
                </p>
            </div>
            <div class="form-section-wrapper">
                <!-- Joining benefites container -->
                <div class="join-benefites">
                    <div class="join-parkspot-container">
                        <AtomHeading class="custom-subtitle" :level="'h3'"
                            >Why should you choose Parkspot?</AtomHeading
                        >
                        <div class="benefits">
                            <ul>
                                <li
                                    v-for="(benefit, index) in JOINING_BENEFITS"
                                    :key="index"
                                >
                                    <span
                                        class="material-symbols-outlined icon"
                                    >
                                        {{ benefit.icon }}
                                    </span>
                                    {{ benefit.text }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
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
        <WhatNext />
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
import WhatNext from '../vo-portal/WhatNext.vue';
import { JOINING_BENEFITS } from '../../constant/constant';

export default {
    name: 'TemplateVOPortal',
    components: {
        AtomIcon,
        AtomHeading,
        BodyWrapper,
        ParkingRequestForm,
        SearchComponent,
        TestimonialSection,
        WhatNext,
    },
    emits: ['submit'],
    data() {
        return {
            headingLevel: 'h6',
            JOINING_BENEFITS: JOINING_BENEFITS,
        };
    },
    methods: {
        onSubmit() {
            this.$emit('submit'); // Emits submit event
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

    .join-benefites {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 2rem 0;
        vertical-align: middle;
        width: 50%;
    }

    .form-wrapper {
        padding: 2rem 0;
        width: 50%;
    }
}

@media (max-width: 768px) {
    .form-section-wrapper {
        flex-direction: column-reverse;
        .join-benefites {
            padding: 3rem 0 0 0;
            width: 100%;
        }

        .form-wrapper {
            padding: 3rem 0 0 0;
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
        background-color: var(--parkspot-white);
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
}

.sub-heading {
    color: var(--secondary-color);
    font-weight: var(--semi-bold-font);
    text-align: center;
}

.custom-subtitle {
    color: var(--secondary-color);
    font-weight: var(--semi-bold-font);
    text-align: start;
}

@media (max-width: 768px) {
    .custom-subtitle {
        font-size: larger;
        text-align: center;
    }

    .heading-container {
        margin-bottom: 0px;
    }

    .benefits {
        margin-top: 0;
    }
}

.join-parkspot-container {
    display: flex;
    color: var(--secondary-color);
    flex-direction: column;
    p {
        color: var(--secondary-color);
        font-weight: var(--semi-bold-font);
        text-align: start;
    }

    .benefits {
        margin-top: 20px;

        ul {
            display: flex;
            flex-direction: column;
            gap: 4px;

            li {
                align-items: center;
                color: var(--parkspot-black);
                display: flex;
                font-weight: var(--semi-bold-font);
                gap: 1rem;
                list-style: none;
                margin: 10px 0;
                vertical-align: middle;
            }
        }

        .icon {
            align-items: center;
            border-radius: 50%;
            border: 1px solid var(--primary-color);
            box-shadow: 0 2px 4px var(--parkspot-muted-black);
            color: var(--secondary-color);
            display: flex;
            font-size: 1.5rem;
            justify-content: center;
            min-height: 50px;
            min-width: 50px;
            transition: transform 0.2s, background-color 0.2s;
        }
    }
}
</style>
