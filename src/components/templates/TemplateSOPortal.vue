<template>
    <div class="page-wrapper">
        <!-- Header Section -->
        <div class="heading-container">
            <AtomHeading :level="'h2'">Welcome to ParkSpot</AtomHeading>
            <p class="sub-heading">
                Let's turn your empty spot into Easy income!
            </p>
        </div>

        <!-- Main Content -->
        <div class="form-section-wrapper">
            <!-- Benefits List -->
            <div class="benefits-section">
                <div class="benefits-container">
                    <AtomHeading class="section-title" :level="'h3'">
                        Why should you choose ParkSpot?
                    </AtomHeading>
                    <ul class="benefits-list">
                        <li
                            v-for="(benefit, index) in JOINING_BENEFITS"
                            :key="index"
                        >
                            <span
                                class="benefit-icon material-symbols-outlined"
                                >{{ benefit.icon }}</span
                            >
                            {{ benefit.text }}
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Form Section -->
            <div class="form-section">
                <div class="register-card">
                    <!-- WhatsApp CTA -->
                    <div class="whatsapp-cta">
                        <p>
                            Chat with us directly on
                            <a
                                href="https://api.whatsapp.com/send/?phone=917488239471&text=I%27m+interested+in+car+parking.&type=phone_number&app_absent=0"
                                target="_blank"
                            >
                                <AtomIcon :icon="'whatsapp'" />
                                WhatsApp
                            </a>
                            for instant support.
                        </p>
                    </div>

                    <div class="divider"><span>OR</span></div>

                    <p class="sub-heading">Register your Parking Spot</p>
                    <RegisterRequestForm @submitForm="submitForm" />
                </div>
            </div>
        </div>

        <!-- Additional Sections -->
        <Whats_Next :heading="`What's next?`" :steps="WHAT_NEXT" />
        <TestimonialSection />
    </div>
</template>

<script>
import AtomHeading from '@/components/atoms/AtomHeading.vue';
import AtomIcon from '@/components/atoms/AtomIcon.vue';
import RegisterRequestForm from '@/components/so-portal/RegisterRequestForm.vue';
import Whats_Next from '@/components/global/Whats_Next.vue';
import TestimonialSection from '@/components/global/TestimonialSection.vue';

import {
    PAGE_TITLE,
    JOINING_BENEFITS_SO,
    WHAT_NEXT_SO,
} from '@/constant/constant';

export default {
    name: 'PageSOPortal',
    components: {
        AtomHeading,
        AtomIcon,
        RegisterRequestForm,
        Whats_Next,
        TestimonialSection,
    },
    emits: ['finalSubmit'],
    metaInfo() {
        return {
            title: PAGE_TITLE.SO_PORTAL,
            titleTemplate: PAGE_TITLE.TITLE_TEMPLATE + '%s',
        };
    },
    data() {
        return {
            isLoading: false,
            JOINING_BENEFITS: JOINING_BENEFITS_SO,
            WHAT_NEXT: WHAT_NEXT_SO,
        };
    },
    methods: {
        submitForm() {
            this.$emit('finalSubmit');
        },
    },
};
</script>
<style lang="scss" scoped>
.benefits-container {
    display: flex;
    flex-direction: column;
}
.benefits-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    list-style: none;

    li {
        align-items: center;
        color: var(--parkspot-black);
        display: flex;
        font-weight: var(--semi-bold-font);
        gap: 1rem;
    }

    .benefit-icon {
        align-items: center;
        border-radius: 50%;
        border: 1px solid var(--primary-color);
        box-shadow: 0 2px 4px var(--parkspot-muted-black);
        color: var(--secondary-color);
        display: flex;
        font-size: 1.4rem;
        height: 48px;
        justify-content: center;
        transition: all 0.2s ease-in-out;
        width: 48px;
    }
}
.benefits-section {
    color: var(--secondary-color);
    flex: 1;
    padding-top: 2%;
}
.divider {
    border-bottom: 1px solid var(--secondary-color);
    margin: 1rem 0;
    position: relative;
    text-align: center;

    span {
        background: var(--parkspot-white);
        color: var(--parkspot-black);
        font-weight: var(--semi-bold-font);
        left: 50%;
        padding: 0 0.5rem;
        position: absolute;
        top: -12px;
        transform: translateX(-50%);
    }
}
.form-section {
    flex: 1;
}
.form-section-wrapper {
    align-items: flex-start;
    display: flex;
    display: flex;
    gap: 4rem;
    justify-content: center;
    margin: 0 auto;
    padding: 0 6rem;
    width: 100%;
}
.heading-container {
    text-align: center;
}
.page-wrapper {
    display: flex;
    flex-direction: column;
    gap: 3rem;
}
.section-title {
    font-size: 2rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
}
.register-card {
    box-shadow:
        0 4px 8px rgba(0, 0, 0, 0.2),
        0 2px 4px rgba(0, 0, 0, 0.15);
    padding: 1.4rem;
}
.sub-heading {
    color: var(--secondary-color);
    font-weight: 500;
    margin-top: 0.2rem;
    text-align: center;
}
.whatsapp-cta {
    text-align: center;
    a {
        color: var(--parkspot-green);
    }
}
@media (min-width: 1600px) {
    .form-section-wrapper {
        max-width: 2800px;
        padding: 0 20rem;
    }
}

@media (max-width: 1100px) {
    .benefits-section {
        margin-top: 2rem;
    }
    .form-section-wrapper {
        flex-direction: column-reverse;
        align-items: center;
    }
    .page-wrapper {
        margin-top: 2rem;
        gap: 1.6rem;
    }
    .section-title {
        text-align: center;
    }
}

@media (max-width: 768px) {
    .benefits-list {
        gap: 16px;
    }
    .form-section-wrapper {
        padding: 0 1rem;
    }
    .heading-container {
        padding: 0 4rem;
    }
    .section-title {
        font-size: 2rem;
    }
}
</style>
