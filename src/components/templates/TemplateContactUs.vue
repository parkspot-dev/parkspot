<template>
    <BodyWrapper>
        <div class="columns">
            <!--
                Phase 2.5b heading-hygiene follow-up: forward the
                page-level decision about whether the embedded
                "Got a question?" headline should be the route's
                primary <h1> (on /contact/) or just a section <h2>
                (everywhere else this template is embedded).
            -->
            <OrganismContactUs
                class="column is-half"
                :heading-level="headingLevel"
            ></OrganismContactUs>
            <div class="column is-half contact-form" data-aos="slide-up">
                <div class="card card-padding">
                    <OrganismContactForm
                        :text-area="true"
                        :form-submitted="formSubmitted"
                        @submit-form="submitForm"
                    ></OrganismContactForm>
                </div>
            </div>
        </div>
    </BodyWrapper>
</template>

<script>
import BodyWrapper from '../extras/BodyWrapper.vue';
import OrganismContactUs from '../organisms/OrganismContactUs.vue';
import OrganismContactForm from '../organisms/OrganismContactForm.vue';
export default {
    name: 'TemplateContactUs',
    components: {
        BodyWrapper,
        OrganismContactUs,
        OrganismContactForm,
    },
    props: {
        // Pass-through to OrganismContactUs. Default 'h2' for the
        // section-embed case (PageHome, PageBlogPost). PageContactUs
        // overrides to 'h1' so /contact/ keeps its single landmark.
        headingLevel: {
            type: String,
            default: 'h2',
            validator: (v) => /^h[1-6]$/.test(v),
        },
    },
    emits: ['contactUs'],
    data() {
        return {
            formSubmitted: false,
        };
    },
    methods: {
        submitForm() {
            this.$emit('contactUs');
        },
    },
};
</script>
<style lang="scss" scoped>
.contact-form {
    max-width: 500px;
}

.card-padding {
    padding-top: 3rem !important;
    padding-right: 1.5rem !important;
    padding-bottom: 4rem !important;
    padding-left: 1.5rem !important;
}
</style>
