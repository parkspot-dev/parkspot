<template>
    <BodyWrapper>
        <div class="columns">
            <div class="column is-half form-container" data-aos="slide-up">
                <div class="card card-padding">
                    <OrganismContactForm
                        :formSubmitted="formSubmitted"
                        @submitForm="submitForm"
                    ></OrganismContactForm>
                </div>
            </div>
        </div>
    </BodyWrapper>
</template>

<script>
import BodyWrapper from '../extras/BodyWrapper.vue';
import OrganismContactForm from '../organisms/OrganismContactForm.vue';

export default {
    name: 'TemplateParkingSpot',
    components: {
        BodyWrapper,
        OrganismContactForm
    },
    emits: ['finalSubmit'],
    data() {
        return {
            formSubmitted: false,
        };
    },
    methods: {
        submitForm() {
            this.$emit('finalSubmit')
        }
    },
};
</script>

<style lang="scss" scoped>
.form-container {
    max-width: 600px;
    margin: 0 auto;
}

.card-padding {
    padding-top: 3rem !important;
    padding-right: 1.5rem !important;
    padding-bottom: 4rem !important;
    padding-left: 1.5rem !important;
}
</style>
