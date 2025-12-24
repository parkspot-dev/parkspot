<template>
    <BodyWrapper>
        <div class="columns">
            <OrganismContactUs class="column is-half"></OrganismContactUs>
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
    emits: ['contactUs'],
    data() {
        return {
            formSubmitted: false,
        };
    },
    methods: {
        submitForm() {
            this.$emit('contactUs')
        }
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
