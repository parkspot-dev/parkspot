<template>
    <BodyWrapper>
        <div class="columns">
            <OrganismContactUs class="column is-half"></OrganismContactUs>
            <div class="column is-half" data-aos="slide-up">
                <div class="card card-padding">
                    <OrganismContactForm
                        :textArea="true"
                        :formSubmitted="formSubmitted"
                        @formValidate="contactFormValidate"
                    ></OrganismContactForm>
                    <AtomButton class="cta-btn" @click.native="sendMsg">
                        <span class="btn-wrap">
                            <span class="btn-text"> Send </span>
                            <AtomIcon
                                class="btn-icon"
                                :icon="'send-outline'"
                            ></AtomIcon>
                        </span>
                    </AtomButton>
                </div>
            </div>
        </div>
    </BodyWrapper>
</template>

<script>
import BodyWrapper from '../extras/BodyWrapper.vue';
import OrganismContactUs from '../organisms/OrganismContactUs.vue';
import OrganismContactForm from '../organisms/OrganismContactForm.vue';
import AtomButton from '../atoms/AtomButton.vue';
import AtomIcon from '../atoms/AtomIcon.vue';
export default {
    name: 'TemplateContactUs',
    components: {
        BodyWrapper,
        OrganismContactUs,
        OrganismContactForm,
        AtomButton,
        AtomIcon,
    },
    emits: ['contactUs'],
    data() {
        return {
            formSubmitted: false,
        };
    },
    methods: {
        sendMsg() {
            this.formSubmitted = true;
        },
        contactFormValidate(flag) {
            if (flag) {
                console.log('template contact us');
                this.$emit('contactUs');
            }
            this.formSubmitted = false;
        },
    },
};
</script>
<style scoped>
.card-padding {
    padding-bottom: 4rem !important;
    padding-left: 1.5rem !important;
    padding-right: 1.5rem !important;
    padding-top: 3rem !important;
}
.cta-btn {
    bottom: 6%;
    left: 50%;
    padding: 1.25rem 2rem;
    position: absolute;
    transform: translate(-50%, 0);
}

.btn-wrap {
    align-items: center;
    display: flex;
    gap: 0.15rem;
    justify-content: center;
}

.btn-text {
    font-weight: var(--semi-bold-font);
    letter-spacing: -1px;
}

.btn-icon {
    font-size: 1.25rem;
    transform: rotate(316deg);
}
</style>
