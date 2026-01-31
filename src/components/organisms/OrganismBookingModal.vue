<template>
    <div class="modal-backdrop" @click.self="closeModal">
        <div class="modal-card">
            <div class="modal-title">
                <h2>Book this Parking Spot</h2>
                <span class="close" @click="closeModal">×</span>
            </div>

            <VeeForm
                :validation-schema="bookingModalFormSchema"
                @submit="submitBooking"
            >
                <div class="modal-body">
                    <FormInput
                        v-model="form.fullName"
                        name="fullName"
                        label="Full Name"
                        placeholder="Enter full name"
                    />

                    <FormInput
                        v-model="form.email"
                        name="email"
                        label="Email"
                        placeholder="Enter email address"
                    />

                    <FormInput
                        v-model="form.mobile"
                        name="mobile"
                        label="Mobile"
                        placeholder="Enter mobile number"
                    />

                    <FormInput
                        v-model="form.vehicleNo"
                        name="vehicleNo"
                        label="Vehicle Number"
                        placeholder="e.g. MH12AB1234"
                    />

                    <AtomButton
                        native-type="submit"
                        :expanded="true"
                        class="primary-btn"
                        :disabled="loading"
                    >
                        {{ loading ? 'Booking...' : 'Book' }}
                    </AtomButton>
                </div>
            </VeeForm>
        </div>
    </div>
</template>

<script>
import AtomButton from '@/components/atoms/AtomButton.vue';
import FormInput from '@/components/global/FormInput.vue';
import { Form as VeeForm } from 'vee-validate';
import { bookingModalFormSchema } from '@/validationSchemas';

export default {
    name: 'OrganismBookingModal',
    components: { AtomButton, FormInput, VeeForm },

    props: {
        initialData: {
            type: Object,
            default: () => ({}),
        },
    },

    emits: ['close', 'submitted'],

    data() {
        return {
            bookingModalFormSchema,
            loading: false,
            form: {
                fullName: '',
                email: '',
                mobile: '',
                vehicleNo: '',
            },
        };
    },

    watch: {
        initialData: {
            immediate: true,
            deep: true,
            handler(val) {
                if (val) this.form = { ...this.form, ...val };
            },
        },
    },

    methods: {
        submitBooking() {
            this.$emit('submitted', this.form);
            this.closeModal();
        },

        closeModal() {
            this.$emit('close');
        },
    },
};
</script>

<style scoped lang="scss">
.modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.modal-card {
    background: #fff;
    width: 420px;
    max-width: 92%;
    padding: 22px;
    border-radius: 14px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
    animation: scaleIn 0.2s ease;
}

.modal-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;

    h2 {
        font-size: 20px;
        font-weight: 600;
        color: #111;
    }

    .close {
        font-size: 26px;
        cursor: pointer;
        color: #999;
        line-height: 1;
    }

    .close:hover {
        color: #000;
    }
}

.modal-body {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 4px;

    label {
        font-size: 13px;
        font-weight: 500;
        color: #333;
    }

    input {
        padding: 11px 12px;
        border-radius: 8px;
        border: 1px solid #ccc;
        font-size: 14px;
        transition: border-color 0.2s ease;
    }

    input:focus {
        outline: none;
        border-color: hsl(141, 53%, 53%);
    }
}

.primary-btn {
    margin-top: 10px;
}

@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

@media (max-width: 480px) {
    .modal-card {
        width: 95%;
        padding: 18px;
    }
}

.error {
    color: red;
    font-size: 12px;
}
</style>
