<template>
    <div v-if="visible" class="dialog-overlay">
        <div class="dialog-content">
            <div class="refund-row">
                <label for="refundAmountInput">Refund Amount:</label>
                <b-input
                    :max="paymentAmount"
                    id="refundAmountInput"
                    type="number"
                    v-model="refundAmount"
                ></b-input>
            </div>

            <div class="security-deposit-row">
                <b-field>
                    <b-checkbox v-model="securityDeposit">
                        isSecurity Deposit
                    </b-checkbox>
                </b-field>
            </div>

            <div class="error-message-container">
                <p v-if="refundAmount > paymentAmount" class="error">
                    Refund amount cannot exceed payment amount.
                </p>
            </div>

            <div class="buttons">
                <b-button @click="cancel">Cancel</b-button>
                <b-button
                    :disabled="refundAmount > paymentAmount"
                    @click="confirm"
                    type="is-primary"
                >
                    Confirm
                </b-button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
    props: {
        visible: Boolean,
        paymentAmount: Number,
    },
    setup(props, { emit }) {
        const refundAmount = ref(props.paymentAmount);
        const securityDeposit = ref(false);
        watch(
            () => props.visible,
            (newValue) => {
                if (newValue) {
                    refundAmount.value = props.paymentAmount;
                }
            },
        );

        const cancel = () => {
            emit('cancel');
        };

        const confirm = () => {
            emit('confirm', {
                refundAmount: refundAmount.value,
                securityDeposit: securityDeposit.value,
            });
        };

        return {
            refundAmount,
            securityDeposit,
            cancel,
            confirm,
        };
    },
};
</script>

<style scoped>
.buttons {
    display: flex;
    justify-content: flex-end;
}

.dialog-overlay {
    align-items: center;
    background-color: rgba(0, 0, 0, 0.05);
    display: flex;
    height: 100%;
    justify-content: center;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 40;
}

.dialog-content {
    background-color: white;
    border-radius: 12px;
    padding: 36px;
    width: 28%;
}

.error-message-container {
    margin: 8px 0px;
    min-height: 20px;
}

.refund-row {
    align-items: center;
    display: flex;
    justify-content: flex-start;
}

.refund-row label {
    margin-right: 12px;
}

.security-deposit-row {
    display: flex;
    justify-content: flex-start;
    margin-top: 24px;
}

@media (max-width: 768px) {
    .dialog-content {
        max-width: 400px;
        padding: 36px;
        width: 40%;
    }

    .refund-row {
        align-items: center;
        flex-direction: row;
        margin-bottom: 4%;
    }

    .refund-row label {
        font-size: 1.1rem;
        margin-bottom: 0;
        margin-right: 16px;
        width: auto;
    }

    .refund-row .b-input {
        flex-grow: 1;
        width: auto;
    }

    .security-deposit-row {
        margin-bottom: 16px;
    }
}
</style>
