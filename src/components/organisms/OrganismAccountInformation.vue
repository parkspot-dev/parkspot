<template>
    <div class="modal-backdrop" @click.self="closeModal">
        <div class="modal-card">
            <div class="modal-title">
                <h2>Account Information</h2>
                <span class="close" @click="closeModal">×</span>
            </div>

            <VeeForm
                :validation-schema="accountInformationSchema"
                @submit="saveAccount"
                @invalid-submit="(e) => console.log(e)"
            >
                <div class="modal-body">
                    <!-- Account Holder Name -->
                    <FormInput
                        v-model="form.fullName"
                        name="fullName"
                        label="Account Holder Name"
                    />

                    <!-- Mode selection -->
                    <div class="radio-group">
                        <label>
                            <Field
                                v-model="form.mode"
                                name="mode"
                                type="radio"
                                value="upi"
                            />
                            UPI ID
                        </label>

                        <label>
                            <Field
                                v-model="form.mode"
                                name="mode"
                                type="radio"
                                value="mobile"
                            />
                            Mobile
                        </label>

                        <label>
                            <Field
                                v-model="form.mode"
                                name="mode"
                                type="radio"
                                value="bank"
                            />
                            Bank
                        </label>
                    </div>

                    <!-- UPI -->
                    <template v-if="form.mode === 'upi'">
                        <FormInput
                            v-model="form.UpiID"
                            name="UpiID"
                            label="UPI ID"
                        />
                        <SelectInput
                            v-model="form.PaymentApp"
                            name="PaymentApp"
                            label="Payment App"
                            :list="[
                                { label: 'Select Payment App', value: '' },
                                ...paymentApps,
                            ]"
                        />
                    </template>

                    <!-- Mobile -->
                    <template v-if="form.mode === 'mobile'">
                        <FormInput
                            v-model="form.Mobile"
                            name="Mobile"
                            label="Mobile Number"
                        />
                        <SelectInput
                            v-model="form.PaymentApp"
                            name="PaymentApp"
                            label="Payment App"
                            :list="[
                                { label: 'Select Payment App', value: '' },
                                ...paymentApps,
                            ]"
                        />
                    </template>

                    <!-- Bank -->
                    <template v-if="form.mode === 'bank'">
                        <FormInput
                            v-model="form.account_number"
                            name="account_number"
                            label="Account Number"
                        />
                        <FormInput
                            v-model="form.ifsc_code"
                            name="ifsc_code"
                            label="IFSC Code"
                        />
                    </template>

                    <AtomButton
                        native-type="submit"
                        :expanded="true"
                        :disabled="loading"
                    >
                        {{ loading ? 'Saving...' : 'Save Account' }}
                    </AtomButton>
                </div>
            </VeeForm>
        </div>
    </div>
</template>

<script>
import AtomButton from '@/components/atoms/AtomButton.vue';
import FormInput from '@/components/global/FormInput.vue';
import SelectInput from '@/components/global/SelectInput.vue';
import { Form as VeeForm, Field } from 'vee-validate';
import { mayaClient } from '@/services/api';
import { accountInformationSchema } from '@/validationSchemas';

export default {
    name: 'OrganismAccountInformation',
    components: {
        AtomButton,
        FormInput,
        SelectInput,
        VeeForm,
        Field,
    },
    props: {
        existingAccount: {
            type: [Object, String, null],
            default: null,
        },
        username: {
            type: String,
            required: true,
        },
    },
    emits: ['close', 'saved'],
    data() {
        return {
            loading: false,
            accountInformationSchema,
            form: {
                mode: 'upi',
                fullName: '',
                UpiID: '',
                Mobile: '',
                PaymentApp: null,
                account_number: '',
                ifsc_code: '',
            },
            paymentApps: [
                { label: 'PhonePe', value: 1 },
                { label: 'GPay', value: 2 },
            ],
        };
    },
    mounted() {
        this.prefillAccount();
    },
    methods: {
        prefillAccount() {
            if (!this.existingAccount) return;

            const acc = this.existingAccount;

            this.form.fullName = acc.FullName || '';

            if (acc.UpiID) {
                this.form.mode = 'upi';
                this.form.UpiID = acc.UpiID;
                this.form.PaymentApp = acc.PaymentApp ?? null;
            }

            if (acc.Mobile) {
                this.form.mode = 'mobile';
                this.form.Mobile = acc.Mobile;
                this.form.PaymentApp = acc.PaymentApp ?? null;
            }

            if (acc.account_number || acc.ifsc_code) {
                this.form.mode = 'bank';
                this.form.account_number = acc.account_number || '';
                this.form.ifsc_code = acc.ifsc_code || '';
            }
        },

        async saveAccount(values) {
            this.loading = true;

            const payload = {
                UserName: this.username,
                FullName: values.fullName.trim(),
            };

            if (values.mode === 'upi') {
                payload.UpiID = values.UpiID.trim();
                payload.PaymentApp = values.PaymentApp;
            }

            if (values.mode === 'mobile') {
                payload.Mobile = values.Mobile.trim();
                payload.PaymentApp = values.PaymentApp;
            }

            if (values.mode === 'bank') {
                payload.account_number = values.account_number.trim();
                payload.ifsc_code = values.ifsc_code.trim();
                payload.PaymentApp = 0;
            }

            try {
                const hasAccount =
                    this.existingAccount &&
                    Number(this.existingAccount.AccountID) > 0;

                if (hasAccount) {
                    await mayaClient.patch(
                        '/auth/user/account-information',
                        payload,
                    );
                } else {
                    await mayaClient.post(
                        '/auth/user/account-information',
                        payload,
                    );
                }

                this.$emit('saved');
            } catch (err) {
                console.error(err);
                alert(
                    err?.response?.data?.DisplayMsg ||
                        'Failed to save account information',
                );
            } finally {
                this.loading = false;
            }
        },

        closeModal() {
            this.loading = false;
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
}

.modal-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;

    h2 {
        font-size: 20px;
        font-weight: 600;
    }

    .close {
        font-size: 26px;
        cursor: pointer;
        color: #999;
    }
}

.modal-body {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.radio-group {
    display: flex;
    gap: 14px;
    font-size: 14px;
    margin-top: 14px;
}
</style>
