<template>
    <div class="container-main">
        <!-- Hero Section -->
        <section class="hero">
            <div class="hero-content">
                <h1>
                    Simplify your <span class="heighlight">parking</span>
                    <br />
                    access management system
                </h1>
                <p>
                    Make your society parking simple, smart, and stress-free for
                    everyone..
                </p>
                <a href="#register">
                    <button class="btn">Register Now</button>
                </a>
            </div>
        </section>

        <!-- Why Choose Section -->
        <section class="why-choose">
            <AtomHeading class="section-title" :level="'h3'">
                Why Choose Parkspot for Your Society?
            </AtomHeading>
            <div class="cards-grid">
                <div
                    class="card"
                    v-for="(service, index) in whyChooseUsOptions"
                    :key="index"
                >
                    <h3>{{ service.title }}</h3>
                    <p>{{ service.description }}</p>
                </div>
            </div>
        </section>

        <!--How its works-->
        <section id="how-its-work">
            <BodyWrapper>
                <WhatsNext :steps="WHAT_NEXT_AUTOMATED_PARKING" />
            </BodyWrapper>
        </section>

        <!-- Registration Form Section -->
        <section class="form-section" id="register">
            <div>
                <h3>Interested in Automated Parking?</h3>
                <p>
                    Schedule a call with us to discuss how ParkSpot can
                    transform your society's parking experience.
                </p>
            </div>
            <!-- Right Side Form -->
            <div class="form-container">
                <Form
                    @submit="handleSubmit"
                    :validation-schema="contactFormSchema"
                >
                    <FormInput
                        :label="FORM.FULLNAME"
                        :placeholder="FORM_PLACEHOLDERS.FULL_NAME"
                        name="fullname"
                        v-model="model.fullname"
                    />

                    <FormInput
                        :label="FORM.EMAIL"
                        :placeholder="FORM_PLACEHOLDERS.EMAIL"
                        name="email"
                        v-model="model.email"
                    />

                    <FormInput
                        :label="FORM.CONTACT_NO"
                        :placeholder="FORM_PLACEHOLDERS.CONTACT_NO"
                        name="cno"
                        v-model="model.cno"
                    />

                    <FormInput
                        :label="FORM.ADDRESS"
                        :placeholder="FORM_PLACEHOLDERS.ADDRESS"
                        name="addr"
                        v-model="model.address"
                    />

                    <button class="send-button" type="submit">
                        Submit
                        <AtomIcon
                            :icon="'send-outline'"
                            class="btn-icon"
                        ></AtomIcon>
                    </button>
                </Form>
            </div>
        </section>

        <!-- Testimonial Section -->
        <section>
            <BodyWrapper>
                <TestimonialSection
                    :testimonials="AUTOMATION_PARKING_PAGE_TESTIMONIALS"
                />
            </BodyWrapper>
        </section>
    </div>
</template>

<script>
import {
    AUTOMATION_PARKING_PAGE_TESTIMONIALS,
    FORM_PLACEHOLDERS,
    FORM,
    WHAT_NEXT_AUTOMATED_PARKING,
    WHY_CHOOSE_PARKSPOT_SOCIETY_AUTOMATION,
} from '@/constant/constant';
import { contactFormSchema } from '@/validationSchemas';
import { Form } from 'vee-validate';
import { mapMutations, mapActions } from 'vuex';
import AtomIcon from '@/components/atoms/AtomIcon.vue';
import AtomHeading from '@/components/atoms/AtomHeading.vue';
import BodyWrapper from '@/components/extras/BodyWrapper.vue';
import FormInput from '@/components/global/FormInput.vue';
import TestimonialSection from '@/components/global/TestimonialSection.vue';
import WhatsNext from '@/components/global/Whats_Next.vue';
export default {
    name: 'PageSocietyParking',
    components: {
        AtomIcon,
        AtomHeading,
        BodyWrapper,
        Form,
        FormInput,
        TestimonialSection,
        WhatsNext,
    },
    metaInfo() {
        return {
            title: 'ParkSpot - Society Parking Management',
            titleTemplate: '%s | ParkSpot',
        };
    },
    data() {
        return {
            WHAT_NEXT_AUTOMATED_PARKING,
            AUTOMATION_PARKING_PAGE_TESTIMONIALS,
            FORM_PLACEHOLDERS,
            FORM,
            model: {
                address: '',
                cno: '',
                email: '',
                fullname: '',
                msg: '[Automated Parking] Interested in scheduling a call',
            },
            contactFormSchema: contactFormSchema,
            whyChooseUsOptions: WHY_CHOOSE_PARKSPOT_SOCIETY_AUTOMATION,
        };
    },
    methods: {
        ...mapActions({
            onlyContact: 'user/onlyContact',
        }),

        ...mapMutations({
            updateContactForm: 'user/update-contact',
        }),

        async handleSubmit() {
            this.updateContactForm(this.model);
            try {
                this.isLoading = true;

                await this.onlyContact();

                this.$router.push({ name: 'thankYou' });
            } catch (error) {
                console.error({ error });

                this.$buefy.toast.open({
                    message: `Something went wrong!`,
                    type: 'is-danger',
                    duration: 2000,
                });

                this.$router.push({ name: 'Home' });
            }
            this.isLoading = false;
        },
    },
};
</script>

<style scoped>
.container-main {
    color: #333;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.6;
}

.heighlight {
    color: var(--primary-color);
    font-weight: bold;
}

/* Hero Section */
.hero {
    align-items: flex-start;
    background-color: #222;
    background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
        url('https://mairsturnstile.com/wp-content/uploads/2024/03/boom-barrier.jpg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    color: white;
    display: flex;
    height: 90vh;
    justify-content: center;
    text-align: center;
}

.hero-content {
    border-radius: 10px;
    padding: 4rem;
    text-align: left;
}

.hero h1 {
    font-size: 3rem;
    line-height: 60px;
    margin-bottom: 0.5rem;
}

.hero p {
    margin-bottom: 1rem;
}

.hero button {
    background-color: var(--primary-color);
    border-radius: 5px;
    border: none;
    color: #000;
    cursor: pointer;
    font-weight: bold;
    padding: 0.75rem 1.5rem;
}

.btn{
    background-color: var(--primary-color);
    border-radius: 5px;
    border: none;
    cursor: pointer;
    display: flex;
    font-size: 16px;
    font-weight: var(--semi-bold-font);
    gap: 8px;
    padding: 10px 20px;
    transition:
        background 0.3s,
        transform 0.2s; 
}

.why-choose {
    background-color: #f9f9f9;
    padding: 4rem 2rem;
    text-align: center;
}

.heading {
    font-size: 2rem;
    margin-bottom: 2rem;
}

.cards-grid {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: repeat(3, 1fr);
    margin: 4rem auto 0 auto;
    max-width: 1200px;
}

.card {
    background-color: var(--parkspot-white);
    border-radius: 12px;
    border: 1px solid var(--primary-color);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 180px;
    padding: 1.5rem;
}

.card h3 {
    color: var(--secondary-color);
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
}

.card p {
    flex-grow: 1;
    font-size: 0.95rem;
    margin-bottom: 1rem;
}

.form-section {
    align-items: center;
    background-color: var(--primary-color);
    display: flex;
    padding: 4rem;
}

.form-section > div {
    flex: 1;
    min-width: 300px;
}

.form-section h3 {
    color: var(--secondary-color);
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
}

.form-section p {
    color: #333;
    font-size: 1.1rem;
    line-height: 1.6;
    max-width: 500px;
}

.form-container {
    backdrop-filter: blur(5px);
    background-color: var(--parkspot-white);
    border-radius: 8px;
    box-shadow: 4px 6px 14px rgba(0, 0, 0, 0.1);
    color: var(--parkspot-black);
    max-width: 40%;
    padding: 2rem;
    width: 100%;
    box-shadow: 4px 6px 14px rgba(0, 0, 0, 0.1);
}



@media (max-width: 768px) {
    .hero h1 {
        font-size: 2rem;
        line-height: 40px;
    }

    .hero-content {
        padding: 1rem;
        text-align: center;
    }

    .cards-grid {
        display: flex;
        flex-direction: column;
    }

    .form-section {
        align-items: center;
        flex-direction: column;
        gap: 20px;
    }

    .form-container {
        min-width: 100%;
    }

    .btn{
        margin: 16px auto;
    }
}
</style>
