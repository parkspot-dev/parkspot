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
                    <VeeForm
                        :validation-schema="contactFormSchema"
                        @submit="handleSubmit"
                    >
                        <h3>Schedule a Call</h3>

                        <FormInput
                            v-model="model.fullname"
                            name="fullname"
                            :label="FORM.FULLNAME"
                            :placeholder="FORM_PLACEHOLDERS.FULL_NAME"
                        />

                        <FormInput
                            v-model="model.cno"
                            name="cno"
                            :label="FORM.CONTACT_NO"
                            :placeholder="FORM_PLACEHOLDERS.CONTACT_NO"
                        />

                        <FormInput
                            v-model="model.address"
                            name="addr"
                            :label="FORM.ADDRESS"
                            :placeholder="FORM_PLACEHOLDERS.ADDRESS"
                        />

                        <FormInput
                            v-model="model.carModel"
                            name="carModel"
                            :label="FORM.CAR_MODEL"
                            :placeholder="FORM_PLACEHOLDERS.CAR_MODEL"
                        />

                        <div class="btn-wrapper">
                            <button type="submit" class="send-button">
                                Submit <AtomIcon class="btn-icon" :icon="'send-outline'"></AtomIcon>
                            </button>
                        </div>
                    </VeeForm>
                </div>
            </div>
        </div>
        <TemplateOurProducts @arrow-btn="onArrowBtn"></TemplateOurProducts>
        <!--
            Embed presentational Templates here, NOT Page wrappers.
            Page* components own the route's metaInfo() and were
            silently overriding the homepage <title> (every mounted
            metaInfo() registers a useHead entry; last-wins). Templates
            are pure presentation and stay silent. Phase 2.5 fix.
        -->
        <TemplateAbout></TemplateAbout>
        <TestimonialSection></TestimonialSection>
        <TemplateContactUs @contact-us="fireContact"></TemplateContactUs>
        <LoaderModal v-if="isLoading"></LoaderModal>
    </div>
</template>
<script>
import { CAR_WASH_SERVICES } from '@/constant/constant';
import { contactFormSchema } from '@/validationSchemas';
import { Form as VeeForm } from 'vee-validate';
import { mapActions, mapMutations } from 'vuex';
import {
    PAGE_TITLE,
    PAGE_DESCRIPTION,
    FORM,
    FORM_PLACEHOLDERS,
} from '@/constant/constant';
import FormInput from '@/components/global/FormInput.vue';
import LoaderModal from '@/components/extras/LoaderModal.vue';
import TemplateAbout from '../components/templates/TemplateAbout.vue';
import TemplateContactUs from '../components/templates/TemplateContactUs.vue';
import TemplateFeatureHome from '../components/templates/TemplateFeatureHome.vue';
import TemplateHomeBanner from '../components/templates/TemplateHomeBanner.vue';
import TemplateOurProducts from '../components/templates/TemplateOurProducts.vue';
import TestimonialSection from '@/components/global/TestimonialSection.vue';
import AtomIcon from '@/components/atoms/AtomIcon.vue';
export default {
    name: 'PageHome',
    components: {
        AtomIcon,
        VeeForm,
        FormInput,
        LoaderModal,
        TemplateAbout,
        TemplateContactUs,
        TemplateFeatureHome,
        TemplateHomeBanner,
        TemplateOurProducts,
        TestimonialSection,
    },
    // Phase 2.5c: emit a route-specific `<meta name="description">`
    // (and matching og:title / og:description) on the homepage so the
    // SSG'd HTML stops inheriting the generic shell description from
    // `index.html`. Google's docs explicitly flag identical-across-
    // pages descriptions as a quality issue and routinely rewrite
    // them from the page body. Title also rewritten to a clean
    // ~55-char value — see `PAGE_TITLE.HOMEPAGE` comment.
    metaInfo() {
        return {
            title: PAGE_TITLE.HOMEPAGE,
            meta: [
                {
                    name: 'description',
                    content: PAGE_DESCRIPTION.HOMEPAGE,
                },
                {
                    property: 'og:title',
                    content: PAGE_TITLE.HOMEPAGE,
                },
                {
                    property: 'og:description',
                    content: PAGE_DESCRIPTION.HOMEPAGE,
                },
                { property: 'og:type', content: 'website' },
                {
                    property: 'og:url',
                    content: 'https://www.parkspot.in/',
                },
            ],
            link: [
                {
                    rel: 'canonical',
                    href: 'https://www.parkspot.in/',
                    key: 'canonical',
                },
            ],
        };
    },
    data() {
        return {
            isLoading: false,
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

        // Handler for the `<TemplateContactUs>` widget embedded in the
        // homepage. Mirrors the wiring in `PageContactUs.vue` and
        // `PageBlogPost.vue` — the same contact-form action is reused
        // verbatim from the user store. Kept inline (rather than
        // extracted into a shared composable) because the rest of the
        // codebase already wires `user/onlyContact` directly at the
        // Page layer; deviating here would be a one-off.
        async fireContact() {
            try {
                this.isLoading = true;
                await this.onlyContact();
                this.$buefy.toast.open({
                    message: 'ParkSpot registered successfully!',
                    type: 'is-success',
                    duration: 2000,
                });
                this.$router.push({
                    name: 'thankYou',
                    query: { from: 'contact' },
                });
            } catch (error) {
                console.error({ error });
                this.$buefy.toast.open({
                    message: `Something went wrong!`,
                    type: 'is-danger',
                    duration: 2000,
                });
                this.$router.push({ name: 'Home' });
            } finally {
                this.isLoading = false;
            }
        },

        async handleSubmit() {
            this.updateContactForm(this.model);
            try {
                this.isLoading = true;

                await this.onlyContact();

                this.$router.push({
                    name: 'thankYou',
                    query: { from: 'contact' },
                });
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
