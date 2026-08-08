<template>
    <div class="identity-kyc">
        <div class="identity-kyc-card">
            <div class="icon-box">
                <AtomIcon icon="shield-key-outline" size="is-small" />
            </div>

            <div class="card-content">
                <div class="title-line">
                    <h2>Identity verification</h2>
                    <span class="status-badge" :class="status.toLowerCase()">
                        <AtomIcon :icon="statusIcon" size="is-small" />
                        {{ statusLabel }}
                    </span>
                </div>

                <p v-if="showForm" class="kyc-description">
                    Opens new tab to verify your identity, it
                    takes less than 2 minutes. Come back here once you're
                    done.
                </p>

                <p v-if="errorMessage" class="kyc-error">{{ errorMessage }}</p>

                <VeeForm
                    v-if="showForm"
                    :validation-schema="identityKycFormSchema"
                    @submit="getVerified"
                >
                    <FormInput
                        v-model="aadhaarNumber"
                        name="aadhaarNumber"
                        label="Aadhaar number"
                        placeholder="1234 5678 9012"
                        :disabled="isBusy"
                    />

                    <button
                        type="submit"
                        class="verify-button"
                        :disabled="isBusy"
                    >
                        <AtomIcon icon="shield-key-outline" size="is-small" />
                        {{ buttonLabel }}
                    </button>
                </VeeForm>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useStore } from 'vuex';
import { Form as VeeForm } from 'vee-validate';
import AtomIcon from '../atoms/AtomIcon.vue';
import FormInput from '../global/FormInput.vue';
import { identityKycFormSchema } from '@/validationSchemas';
import { IdentityKycStatus } from '@/constant/enums';

const STATUS_META = {
    [IdentityKycStatus.NotVerified]: { label: 'Not verified', icon: 'circle-small' },
    [IdentityKycStatus.Pending]: { label: 'Pending', icon: 'circle-small' },
    [IdentityKycStatus.Verified]: { label: 'Verified', icon: 'check-circle' },
    [IdentityKycStatus.Failed]: { label: 'Failed', icon: 'alert-circle' },
};

const store = useStore();
const aadhaarNumber = ref('');

// TODO: rename once the real user API field for this is confirmed.
const isProfileVerified = computed(() => store.state.user.userProfile?.verified);

const status = computed(() =>
    isProfileVerified.value ? IdentityKycStatus.Verified : store.state.identityKyc.status,
);
const errorMessage = computed(() => store.state.identityKyc.errorMessage);
const showForm = computed(() => status.value !== IdentityKycStatus.Verified);

const isBusy = computed(() => status.value === IdentityKycStatus.Pending);

// status.value is always a valid IdentityKycStatus key, so no fallback.
const statusLabel = computed(() => STATUS_META[status.value].label);
const statusIcon = computed(() => STATUS_META[status.value].icon);

const buttonLabel = computed(() => {
    if (status.value === IdentityKycStatus.Pending) return 'Verifying…';
    if (status.value === IdentityKycStatus.Failed) return 'Retry Verification';
    return 'Get Verified';
});

async function getVerified(values) {
    const idNumber = (values.aadhaarNumber || '').replace(/\s+/g, '');

    let redirectUrl;
    try {
        redirectUrl = await store.dispatch('identityKyc/initiateKyc', { idNumber });
    } catch {
        // Error state already committed by the action.
        return;
    }

    openVerificationTab(redirectUrl);
}

function openVerificationTab(url) {
    // Null `opener` explicitly — 'noopener' as a window.open() feature is unreliable (e.g. Safari) and lets the opened page redirect this tab.
    const win = window.open('', '_blank');

    if (!win) {
        // Popup blocked — fall back to a same-tab redirect.
        window.location.href = url;
        return;
    }

    win.opener = null;
    win.location.href = url;

    attachReturnListener();
}

// Check once when the user returns to this tab.
let checkInFlight = false;

async function handleReturnToTab() {
    if (checkInFlight || status.value !== IdentityKycStatus.Pending) return;
    if (!store.state.identityKyc.verificationId) return;

    checkInFlight = true;
    try {
        await store.dispatch('identityKyc/checkKycStatus');
    } finally {
        checkInFlight = false;
    }
}

function onVisibilityChange() {
    if (document.visibilityState === 'visible') handleReturnToTab();
}

function attachReturnListener() {
    document.addEventListener('visibilitychange', onVisibilityChange);
}

onMounted(() => {
    // Re-attach if we mounted mid-verification (e.g. after the same-tab fallback).
    if (
        status.value === IdentityKycStatus.Pending &&
        store.state.identityKyc.verificationId
    ) {
        attachReturnListener();
    }
});

onUnmounted(() => {
    document.removeEventListener('visibilitychange', onVisibilityChange);
});
</script>

<style lang="scss" scoped>
.identity-kyc {
    margin-top: 32px;
}

.identity-kyc-card {
    display: flex;
    gap: 16px;
    border: 1px solid #e5e5ea;
    border-radius: var(--border-default);
    padding: 24px;
    background: var(--parkspot-white);
}

.icon-box {
    flex: 0 0 auto;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: #f1ede4;
    display: flex;
    align-items: center;
    justify-content: center;
}

.card-content {
    flex: 1 1 auto;
    min-width: 0;
    padding-top: 0;
}

.title-line {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 8px;

    h2 {
        font-size: 16px;
        font-weight: 600;
        color: var(--parkspot-black);
    }
}

.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: var(--semi-bold-font);
    padding: 3px 10px;
    border-radius: 999px;
    background: #f1f1f4;
    color: #6e6d7a;

    &.verified {
        background: #e6f7ff;
        color: var(--secondary-color);
    }
    &.failed {
        background: #fdecef;
        color: var(--parkspot-red);
    }
    &.pending {
        background: #fff8e8;
        color: #a17a00;
    }
}

.kyc-description {
    font-size: 14px;
    color: #6e6d7a;
    margin-bottom: 16px;
}

.kyc-error {
    color: var(--parkspot-red);
    font-size: 13px;
    margin: -8px 0 16px;
}

.verify-button {
    align-items: center;
    background-color: var(--primary-color);
    border-radius: 5px;
    border: none;
    cursor: pointer;
    display: inline-flex;
    gap: 8px;
    font-size: 14px;
    font-weight: var(--semi-bold-font);
    color: var(--parkspot-black);
    padding: 10px 20px;
    margin-top: 4px;

    &:disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }
}
</style>
