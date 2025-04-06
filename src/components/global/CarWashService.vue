<template>
    <div class="carwash-section">
        <div class="container">
            <div class="text">
                <h2>
                    Get Car Wash At Your Door Step
                    <span class="highlight">Starting from ₹249</span>
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
                        label="Fullname"
                        placeholder="Enter Your Fullname"
                        v-model="model.fullname"
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
                        v-model="model.addr"
                    />

                    <div class="btn-wrapper">
                        <button type="submit" class="submit-btn">Submit</button>
                    </div>
                </Form>
            </div>
        </div>
    </div>
</template>

<script>
import { CAR_WASH_SERVICES } from '@/constant/constant';
import { contactFormSchema } from '@/validationSchemas';
import { Form } from 'vee-validate';
import { mapActions, mapMutations } from 'vuex';
import FormInput from '@/components/global/FormInput.vue';

export default {
    name: 'CarWashService',
    components: {
        Form,
        FormInput,
    },
    data() {
        return {
            carWashServices: CAR_WASH_SERVICES,
            model: {
                fullname: '',
                cno: '',
                addr: '',
                msg: '[Car Wash Request]',
            },
            contactFormSchema,
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

                this.$buefy.toast.open({
                    message:
                        "Thank you for your request! We'll get in touch shortly.",
                    type: 'is-success',
                    duration: 2000,
                });

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
</style>
