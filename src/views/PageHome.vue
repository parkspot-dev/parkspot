<template>
    <div id="Home">
        <TemplateHomeBanner></TemplateHomeBanner>
        <TemplateFeatureHome></TemplateFeatureHome>
        <!-- Car Wash Section -->
        <div id="car-wash" class="carwash-section">
            <div class="container">
                <div class="text">
                    <h2>
                        Get Full Car Wash At Your Door Step
                        <span>Starting from ₹1499</span>
                    </h2>
                    <ul class="service-list">
                        <li
                            v-for="(service, index) in carWashServices"
                            :key="index"
                        >
                            <span class="material-symbols-outlined">
                                chevron_right
                            </span>
                            {{ service }}
                        </li>
                    </ul>
                </div>

                <!-- Right Side Form -->
                <div class="form-container">
                    <Form
                        @submit="handleSubmit"
                        :validation-schema="contactFormSchema"
                    >
                        <h3>Schedule a Call</h3>

                        <FormInput
                            name="fullname"
                            :label="FORM.FULLNAME"
                            :placeholder="FORM_PLACEHOLDERS.FULLNAME"
                            v-model="model.fullname"
                        />

                        <FormInput
                            name="cno"
                            :label="FORM.CONTACT_NO"
                            :placeholder="FORM_PLACEHOLDERS.CONTACT_NO"
                            v-model="model.cno"
                        />

                        <FormInput
                            name="addr"
                            :label="FORM.ADDRESS"
                            :placeholder="FORM_PLACEHOLDERS.ADDRESS"
                            v-model="model.address"
                        />

                        <FormInput
                            name="carModel"
                            :label="FORM.CAR_MODEL"
                            :placeholder="FORM_PLACEHOLDERS.CAR_MODEL"
                            v-model="model.carModel"
                        />

                        <div class="btn-wrapper">
                            <button type="submit" class="send-button">
                                Submit <AtomIcon class="btn-icon" :icon="'send-outline'"></AtomIcon>
                            </button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
        <TemplateOurProducts @arrowBtn="onArrowBtn"></TemplateOurProducts>
        <PageAbout></PageAbout>
        <TestimonialSection></TestimonialSection>
        <PageContactUs></PageContactUs>
    </div>
</template>
<script>
import { CAR_WASH_SERVICES } from '@/constant/constant';
import { contactFormSchema } from '@/validationSchemas';
import { Form } from 'vee-validate';
import { mapActions, mapMutations } from 'vuex';
import { PAGE_TITLE, FORM, FORM_PLACEHOLDERS } from '@/constant/constant';
import FormInput from '@/components/global/FormInput.vue';
import PageAbout from './PageAbout.vue';
import PageContactUs from './PageContactUs.vue';
import TemplateFeatureHome from '../components/templates/TemplateFeatureHome.vue';
import TemplateHomeBanner from '../components/templates/TemplateHomeBanner.vue';
import TemplateOurProducts from '../components/templates/TemplateOurProducts.vue';
import TestimonialSection from '@/components/global/TestimonialSection.vue';
import AtomIcon from '@/components/atoms/AtomIcon.vue';
export default {
    name: 'PageHome',
    components: {
        AtomIcon,
        Form,
        FormInput,
        PageAbout,
        PageContactUs,
        TemplateFeatureHome,
        TemplateHomeBanner,
        TemplateOurProducts,
        TestimonialSection,
    },
    metaInfo() {
        return {
            title: PAGE_TITLE.HOMEPAGE,
        };
    },
    data() {
        return {
            carWashServices: CAR_WASH_SERVICES,
            model: {
                fullname: '',
                cno: '',
                address: '',
                msg: '[Car Wash Request]',
                carModel: ''
            },
            contactFormSchema,
            FORM: FORM,
            FORM_PLACEHOLDERS : FORM_PLACEHOLDERS
        };
    },
    methods: {
        ...mapActions({
            onlyContact: 'user/onlyContact',
        }),

        ...mapMutations({
            updateContactForm: 'user/update-contact',
        }),

        onArrowBtn() {
            this.$router.push({ name: 'contactUs' });
        },

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
.carwash-section {
    background-color: var(--parkspot-white);
    background-image: linear-gradient(
            rgba(0, 0, 0, 0.714),
            rgba(0, 0, 0, 0.763)
        ),
        url('/assets/car-wash-parkspot.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    padding: 3rem 1rem;
    width: 100%;
}

.container {
    align-items: flex-start;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 0 auto;
    max-width: 1200px;
}

.text {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    max-width: 50%;
    padding: 1rem;
    width: 100%;
}

h2 {
    color: var(--parkspot-white);
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 1rem;
}

span {
    color: var(--primary-color) !important;
}

.service-list {
    list-style: none;
    padding: 0;
}

.service-list li {
    align-items: center;
    color: var(--parkspot-white);
    display: flex;
    font-size: 1rem;
    margin-bottom: 0.5rem;
}

.material-symbols-outlined {
    color: var(--primary-color);
}

.form-container {
    backdrop-filter: blur(5px);
    background-color: var(--parkspot-white);
    border-radius: 8px;
    color: var(--parkspot-black);
    max-width: 40%;
    padding: 2rem;
    width: 100%;
}

@media (max-width: 900px) {
    .container {
        flex-direction: column;
    }

    .text {
        min-width: 100%;
    }

    .form-container {
        min-width: 100%;
    }
}

form h3 {
    color: var(--secondary-color);
    font-size: 1.5rem;
    font-weight: 500;
    margin-bottom: 1rem;
}

.btn-wrapper {
    text-align: center;
    width: 100%;
}

.btn-icon {
    font-size: 1.25rem;
}
</style>
