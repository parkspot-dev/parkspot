<template>
    <div class="container-main">
        <!-- Hero Section -->
        <section class="hero">
            <div class="hero-content">
                <h1>
                    Simplify Your <span class="heighlight">Society's</span>
                    <br />
                    Parking Experience
                </h1>
                <p>
                    Smart parking management for residents, visitors & admins.
                </p>
                <button>Register Now</button>
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
                    <a :href="service.redirectUrl"><button class="btn"  >{{ service.button }}</button></a>
                </div>
            </div>
        </section>

        <!--How its works-->
        <section id="how-its-work" >
            <BodyWrapper>
                <Whats_Next :steps="WHAT_NEXT_SO" />
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
                        name="fullname"
                        label="Fullname"
                        placeholder="Enter Your Fullname"
                        v-model="model.fullname"
                    />

                    <FormInput
                        name="email"
                        label="Email"
                        placeholder="example@gmail.com"
                        v-model="model.email"
                    />

                    <FormInput
                        name="cno"
                        label="Mobile Number"
                        placeholder="Enter Your Mobile Number"
                        v-model="model.cno"
                    />

                    <FormInput
                        name="addr"
                        label="Address"
                        placeholder="Enter Your Address"
                        v-model="model.address"
                    />

                    <div class="btn-wrapper">
                        <button type="submit" class="btn">Submit</button>
                    </div>
                </Form>
            </div>
        </section>

        <!-- Testimonial Section -->
        <section>
            <BodyWrapper>
                <TestimonialSection />
            </BodyWrapper>
        </section>
    </div>
</template>

<script>
import TestimonialSection from '@/components/global/TestimonialSection.vue';
import Whats_Next from '@/components/global/Whats_Next.vue';
import { WHAT_NEXT_SO } from '@/constant/constant';
import FormInput from '@/components/global/FormInput.vue';
import { contactFormSchema } from '@/validationSchemas';
import { mapMutations, mapActions } from 'vuex';
import AtomHeading from '@/components/atoms/AtomHeading.vue';
import BodyWrapper from '@/components/extras/BodyWrapper.vue';
import { Form } from 'vee-validate';
export default {
    name: 'PageSocietyParking',
    components: {
        Whats_Next,
        TestimonialSection,
        FormInput,
        AtomHeading,
        BodyWrapper,
        Form,
    },
    metaInfo() {
        return {
            title: 'ParkSpot - Society Parking Management',
            titleTemplate: '%s | ParkSpot',
        };
    },
    data() {
        return {
            WHAT_NEXT_SO: WHAT_NEXT_SO,
            model: {
                fullname: '',
                cno: '',
                address: '',
                msg: '[Automated Parking] Interested in scheduling a call',
                email: '',
            },
            contactFormSchema: contactFormSchema,
            whyChooseUsOptions: [
                {
                    title: 'Seamless Operations',
                    description:
                        'Automate entry, exit, and slot allocation with real-time tracking.',
                    button: 'Learn more',
                    redirectUrl: '/automated-parking'
                },
                {
                    title: 'Resident-Friendly',
                    description:
                        'Mobile access and hassle-free parking for all residents and guests.',
                    button: 'Get started',
                    redirectUrl: '/automated-parking#register'
                },
                {
                    title: 'Admin Control',
                    description:
                        'Manage user roles, generate reports, and configure society-specific rules.',
                    button: 'See features',
                    redirectUrl: '/features'
                },
                {
                    title: 'Security & Monitoring',
                    description:
                        'Track vehicle history, enable alerts, and integrate with CCTV systems.',
                    button: 'Explore',
                    redirectUrl: '/automated-parking#how-its-work'
                },
                {
                    title: 'Visitor Management',
                    description:
                        'Pre-booking, QR codes, and smoother entry experience for visitors.',
                    button: 'Know more',
                    redirectUrl: '/'
                },
                {
                    title: 'Need Custom Setup?',
                    description:
                        'We customize solutions for your society’s unique needs.',
                    button: 'Contact now',
                    redirectUrl: '/contact'
                },
            ],
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
    background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
        url('https://media.gettyimages.com/id/1397252319/photo/red-car-paked-in-underground-garage-with-lots-of-vehicles.jpg?b=1&s=2048x2048&w=0&k=20&c=zYf5DmORC8KX0XsWX-pxzTQh615LZfIoGm2H3HCr_cM=');
    background-color: #222;
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
    margin-bottom: 0.5rem;
    line-height: 60px;
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
    min-height: 220px;
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

.btn {
    background-color: var(--secondary-color);
    border-radius: 6px;
    border: none;
    color: #fff;
    cursor: pointer;
    font-weight: 600;
    padding: 0.6rem 1.2rem;
    transition: background 0.3s;
}

.btn:hover {
    background-color: white;
    border: 1px solid var(--secondary-color);
    color: var(--secondary-color);
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
    font-size: 1.1rem;
    line-height: 1.6;
    color: #333;
    max-width: 500px;
}

.form-container {
    backdrop-filter: blur(5px);
    background-color: var(--parkspot-white);
    border-radius: 8px;
    color: var(--parkspot-black);
    max-width: 40%;
    padding: 2rem;
    width: 100%;
    box-shadow: 4px 6px 14px rgba(0, 0, 0, 0.1);
}

.btn-wrapper {
    margin-top: 20px;
    text-align: center;
    width: 100%;
}

.submit-btn {
    background-color: var(--primary-color);
    border-radius: 4px;
    border: none;
    color: black;
    cursor: pointer;
    font-weight: bold;
    margin-top: 1rem;
    padding: 0.6rem 1.2rem;
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
    }

    .form-container {
        min-width: 100%;
    }
}
</style>
