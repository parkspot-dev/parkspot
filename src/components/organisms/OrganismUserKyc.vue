<template>
    <div class="identity-kyc">
        <b-collapse
            v-model="isOpen"
            class="identity-kyc-card"
            animation="slide"
            aria-id="identity-kyc-content"
        >
            <template #trigger="{ open }">
                <div
                    class="card-header"
                    :class="{ locked: isLocked }"
                    role="button"
                    :tabindex="isLocked ? -1 : 0"
                    :aria-disabled="isLocked"
                    aria-controls="identity-kyc-content"
                    :aria-expanded="open"
                    @click="onHeaderClick"
                    @keydown.enter.space.prevent="onHeaderKeydown"
                >
                    <div class="icon-box" :class="status.toLowerCase()">
                        <AtomIcon icon="shield-key-outline" size="is-small" />
                    </div>

                    <div class="title-line">
                        <h2>Identity verification</h2>
                        <span class="status-badge" :class="status.toLowerCase()">
                            {{ statusLabel }}
                        </span>
                    </div>

                    <AtomIcon
                        v-if="!isLocked"
                        class="chevron"
                        :icon="open ? 'menu-up' : 'menu-down'"
                        size="is-small"
                    />
                </div>
            </template>

            <div v-if="!isLocked" class="card-content">
                <p v-if="showForm" class="kyc-description">
                    Opens new tab to verify your identity, it
                    takes less than 2 minutes. Come back here once you're
                    done.
                </p>

                <p v-if="errorMessage" class="kyc-error">{{ errorMessage }}</p>

                <VeeForm
                    v-if="showForm"
                    class="kyc-form"
                    :validation-schema="identityKycFormSchema"
                    @submit="getVerified"
                >
                    <FormInput
                        v-model="aadhaarNumber"
                        name="aadhaarNumber"
                        label="Aadhaar number"
                        placeholder="1234 5678 9012"
                        maxlength="14"
                        inputmode="numeric"
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
        </b-collapse>
    </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { Form as VeeForm } from 'vee-validate';
import AtomIcon from '../atoms/AtomIcon.vue';
import FormInput from '../global/FormInput.vue';
import { identityKycFormSchema } from '@/validationSchemas';
import { IdentityKycStatus, KYCStatus } from '@/constant/enums';

const STATUS_META = {
    [IdentityKycStatus.NotVerified]: { label: 'Not verified' },
    [IdentityKycStatus.Pending]: { label: 'Pending' },
    [IdentityKycStatus.Verified]: { label: 'Verified' },
    [IdentityKycStatus.Failed]: { label: 'Failed' },
};

const store = useStore();
const aadhaarNumber = ref('');

// Group into 4-4-4 as the user types, matching the "1234 5678 9012" placeholder.
function formatAadhaarNumber(value) {
    const digits = value.replace(/\D/g, '').slice(0, 12);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

watch(aadhaarNumber, (value) => {
    const formatted = formatAadhaarNumber(value);
    if (formatted !== value) aadhaarNumber.value = formatted;
});

// Buefy's b-collapse only wires a click handler on the trigger — Enter/Space
// need to be forwarded manually so the header is keyboard-operable.
function onHeaderKeydown(event) {
    if (isLocked.value) return;
    event.currentTarget.click();
}

// Verified card has nothing left to show (showForm is false) — block the
// click before it reaches b-collapse's own toggle listener on the wrapper.
function onHeaderClick(event) {
    if (isLocked.value) event.stopPropagation();
}

const isProfileVerified = computed(
    () => store.state.user.userProfile?.KYCStatus === KYCStatus.IDVerified,
);

const status = computed(() =>
    isProfileVerified.value ? IdentityKycStatus.Verified : store.state.identityKyc.status,
);
const errorMessage = computed(() => store.state.identityKyc.errorMessage);
const showForm = computed(() => status.value !== IdentityKycStatus.Verified);
const isLocked = computed(() => status.value === IdentityKycStatus.Verified);

// Collapsed by default once verified — there's nothing left to act on.
const isOpen = ref(status.value !== IdentityKycStatus.Verified);

const isBusy = computed(() => status.value === IdentityKycStatus.Pending);

// status.value is always a valid IdentityKycStatus key, so no fallback.
const statusLabel = computed(() => STATUS_META[status.value].label);

const buttonLabel = computed(() => {
    if (status.value === IdentityKycStatus.Pending) return 'Verifying…';
    if (status.value === IdentityKycStatus.Failed) return 'Retry Verification';
    return 'Get Verified';
});

async function getVerified(values) {
    const idNumber = (values.aadhaarNumber || '').replace(/\s+/g, ''); // remove formatted adhaar number group into 4-4-4

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
    border: 1px solid #e5e5ea;
    border-radius: var(--border-default);
    background: var(--parkspot-white);
}

.card-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 24px;
    cursor: pointer;

    &:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: -2px;
    }

    &.locked {
        cursor: default;
    }
}

.icon-box {
    flex: 0 0 auto;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: #f1ede4;
    display: flex;
    align-items: center;
    justify-content: center;

    // Match the status-badge palette so the icon reflects the same state.
    &.not_verified {
        background: #faeeda;
        :deep(i::before) {
            color: #854f0b;
        }
    }
    &.pending {
        background: #e6f1fb;
        :deep(i::before) {
            color: #185fa5;
        }
    }
    &.failed {
        background: #fcebeb;
        :deep(i::before) {
            color: #a32d2d;
        }
    }
    &.verified {
        background: #eaf3de;
        :deep(i::before) {
            color: #3b6d11;
        }
    }
}

.card-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 0 24px 24px;
}

.chevron {
    flex: 0 0 auto;
    margin-left: auto;
    color: #6e6d7a;

    // The mdi webfont sets its own font-size on the ::before glyph (not the
    // <i> element), so overriding font-size on <i> alone has no visible
    // effect — the pseudo-element itself has to be targeted.
    :deep(i::before) {
        font-size: 24px !important;
    }
}

.title-line {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;

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
    border: 1px solid transparent;

    &.not_verified {
        background: #faeeda;
        color: #854f0b;
        border-color: #ef9f27;
    }
    &.pending {
        background: #e6f1fb;
        color: #185fa5;
        border-color: #378add;
    }
    &.failed {
        background: #fcebeb;
        color: #a32d2d;
        border-color: #e24b4a;
    }
    &.verified {
        background: #eaf3de;
        color: #3b6d11;
        border-color: #97c459;
    }
}

.kyc-description {
    font-size: 14px;
    color: #6e6d7a;
        padding: 16px 0 0px 0px;
}

.kyc-error {
    color: var(--parkspot-red);
    font-size: 13px;
}

.kyc-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.verify-button {
    align-items: center;
    background-color: var(--primary-color);
    border-radius: 5px;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    gap: 8px;
    font-size: 14px;
    font-weight: var(--semi-bold-font);
    color: var(--parkspot-black);
    padding: 10px 20px;
    margin: 0 auto;

    &:disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }
}

@media (max-width: 600px) {
    .card-header {
        gap: 12px;
        padding: 12px 16px;
    }

    .icon-box {
        width: 32px;
        height: 32px;
    }

    .title-line {
        h2 {
            font-size: 15px;
        }
    }

    .card-content {
        gap: 12px;
        padding: 0 16px 16px;
    }

    .verify-button {
        width: 100%;
    }
}
</style>
