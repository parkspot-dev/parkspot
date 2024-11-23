<template>
    <div>
        <BodyWrapper>
            <AtomHeading class="mb-5 has-text-centered">
                Fill the form to Request a Parking Spot
            </AtomHeading>
            <div class="form-section-wrapper">
                <!-- Info graphic -->
                <div class="info-graphic"></div>
                <!-- Parking request form -->
                <div class="form-wrapper">
                    <div class="request-form">
                        <AtomHeading
                            :level="headingLevel"
                            class="mb-5 has-text-centered"
                        >
                            Apply for Parking Service
                        </AtomHeading>
                        <ParkingRequestForm
                            :formSubmitted="btnStack[0]"
                            @formValidate="contactFormValidate"
                        />
                    </div>
                </div>
            </div>
        </BodyWrapper>
        <SearchComponent />
        <TestimonialSection />
    </div>
</template>

<script>
import BodyWrapper from '../extras/BodyWrapper.vue';
import AtomHeading from '../atoms/AtomHeading.vue';
import SearchComponent from '../vo-portal/SearchComponent.vue';
import TestimonialSection from '../global/TestimonialSection.vue';
import ParkingRequestForm from '../vo-portal/ParkingRequestForm.vue';
export default {
    name: 'TemplateVOPortal',
    components: {
        BodyWrapper,
        AtomHeading,
        SearchComponent,
        TestimonialSection,
        ParkingRequestForm,
    },
    emits: ['finalSubmit'],
    data() {
        return {
            activeStep: 0,

            hasNavigation: false,
            customNavigation: true,
            isProfileSuccess: false,
            contactFormStep: false,
            KYCFormStep: false,
            AddInfoFormStep: false,

            prevIcon: 'chevron-left',
            nextIcon: 'chevron-right',
            labelPosition: 'bottom',
            mobileMode: 'minimalist',

            isStepsClickable: false,

            headingLevel: 'h5',

            nextEnable: null,
            nextText: 'Next',
            btnStack: [false, false],
            top: 0,

            reRender: 0,
        };
    },
    methods: {
        btnNext(next) {
            // map fix setTimeout out to load compeletely
            setTimeout(() => {
                this.reRender++;
            }, 10);
            // this.btnStack[this.top] = true; // this is not updating the array in vue
            this.btnStack.splice(this.top, 1, true); // this is to trigger validation in the form
            this.nextEnable = next;
        },
        btnPrev(previous) {
            this.top--;
            this.btnStack.splice(this.top, 1, false);
            this.nextText = 'Next';
            previous.action();
        },
        contactFormValidate(val) {
            this.btnStack.splice(this.top, 1, val);
            if (this.btnStack[this.top]) {
                this.nextEnable.action();
                this.top++;
                this.nextText = 'Finish';
            }
        },
        kycFormValidate(val) {
            this.btnStack.splice(this.top, 1, val);
            if (this.btnStack[this.top]) {
                this.nextEnable.action();
                this.top++;
            }
        },
        // addressFormValidate(val) {
        //     this.btnStack.splice(this.top, 1, val);
        //     if (this.btnStack[this.top]) {
        //         this.nextEnable.action();
        //         this.nextText = 'Finish';
        //         this.top++;
        //     }
        // },
        preferenceFormValidate(val) {
            this.btnStack.splice(this.top, 1, val);
            if (this.btnStack[this.top]) {
                this.nextEnable.action();
                this.$emit('finalSubmit');
            }
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
    .info-graphic {
        width: 50%;
    }
    .form-wrapper {
        width: 50%;
        padding: 20px;
    }
}

@media (max-width: 768px) {
    .form-section-wrapper {
        flex-direction: column;
        .info-graphic {
            width: 100%;
        }
        .form-wrapper {
            width: 100%;
            padding: 10px;
        }
    }
}

.request-form {
    // background-color: var(--primary-color);
    padding: 2rem 1rem;
    border-radius: var(--border-default);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.15);
}
</style>
