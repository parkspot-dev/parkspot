<template>
    <div class="rc-kyc">
        <b-collapse
            v-model="isOpen"
            class="rc-kyc-card"
            animation="slide"
            aria-id="rc-kyc-content"
        >
            <template #trigger="{ open }">
                <div
                    class="card-header"
                    :class="{ locked: isLocked }"
                    role="button"
                    :tabindex="isLocked ? -1 : 0"
                    :aria-disabled="isLocked"
                    aria-controls="rc-kyc-content"
                    :aria-expanded="open"
                    @click="onHeaderClick"
                    @keydown.enter.space.prevent="onHeaderKeydown"
                >
                    <div class="icon-box" :class="status.toLowerCase()">
                        <AtomIcon icon="car-outline" size="is-small" />
                    </div>

                    <div class="title-line">
                        <h2>RC verification</h2>
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
                    Enter your vehicle's registration number to verify ownership.
                </p>

                <p v-if="errorMessage" class="kyc-error">{{ errorMessage }}</p>

                <VeeForm
                    v-if="showForm"
                    class="kyc-form"
                    :validation-schema="vehicleRcFormSchema"
                    @submit="handleVerifySubmit"
                >
                    <FormInput
                        v-model="vehicleNumber"
                        name="vehicleNumber"
                        label="Vehicle number"
                        placeholder="KA01AB1234"
                        maxlength="10"
                        :disabled="isBusy"
                    />

                    <button
                        type="submit"
                        class="verify-button"
                        :disabled="isBusy"
                    >
                        <AtomIcon icon="car-outline" size="is-small" />
                        {{ buttonLabel }}
                    </button>
                </VeeForm>
            </div>
        </b-collapse>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { Form as VeeForm } from 'vee-validate';
import AtomIcon from '../atoms/AtomIcon.vue';
import FormInput from '../global/FormInput.vue';
import { vehicleRcFormSchema } from '@/validationSchemas';
import { KYCStatus, VehicleRcStatus } from '@/constant/enums';

const STATUS_META = {
    [VehicleRcStatus.NotVerified]: { label: 'Not verified' },
    [VehicleRcStatus.Pending]: { label: 'Verifying…' },
    [VehicleRcStatus.Verified]: { label: 'Verified' },
    [VehicleRcStatus.Failed]: { label: 'Failed' },
};

const store = useStore();
const vehicleNumber = ref('');
const isSubmitting = ref(false);
const submitFailed = ref(false);

watch(vehicleNumber, (value) => {
    const upper = value.toUpperCase();
    if (upper !== value) vehicleNumber.value = upper;
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

const isProfileVerified = computed(() => {
    const kycStatus = store.state.user.userProfile?.KYCStatus;
    return kycStatus === KYCStatus.OwnershipVerified || kycStatus === KYCStatus.Verified;
});

// Synchronous call — no verification-id/polling state to persist, so the
// only states are: already verified (from the profile), mid-submit,
// failed last attempt, or not started.
const status = computed(() => {
    if (isProfileVerified.value) return VehicleRcStatus.Verified;
    if (isSubmitting.value) return VehicleRcStatus.Pending;
    if (submitFailed.value) return VehicleRcStatus.Failed;
    return VehicleRcStatus.NotVerified;
});

const errorMessage = computed(() => store.state.vehicleRc.errorMessage);
const showForm = computed(() => status.value !== VehicleRcStatus.Verified);
const isLocked = computed(() => status.value === VehicleRcStatus.Verified);

// Collapsed by default once verified — there's nothing left to act on.
const isOpen = ref(status.value !== VehicleRcStatus.Verified);

const isBusy = computed(() => isSubmitting.value);

const statusLabel = computed(() => STATUS_META[status.value].label);

const buttonLabel = computed(() => {
    if (isSubmitting.value) return 'Verifying…';
    if (submitFailed.value) return 'Retry Verification';
    return 'Get Verified';
});

async function handleVerifySubmit(values) {
    isSubmitting.value = true;
    try {
        await store.dispatch('vehicleRc/verifyRc', {
            vehicleNumber: values.vehicleNumber,
        });
        submitFailed.value = false;
    } catch {
        // Error state already committed by the action.
        submitFailed.value = true;
    } finally {
        isSubmitting.value = false;
    }
}
</script>

<style lang="scss" scoped>
@use 'sass:list';
// bg, text, border — used to derive both .icon-box and .status-badge palettes below.
$status-colors: (
    not_verified: (var(--parkspot-status-not-verified-bg), var(--parkspot-status-not-verified-text), var(--parkspot-status-not-verified-border)),
    pending: (var(--parkspot-status-pending-bg), var(--parkspot-status-pending-text), var(--parkspot-status-pending-border)),
    failed: (var(--parkspot-status-failed-bg), var(--parkspot-status-failed-text), var(--parkspot-status-failed-border)),
    verified: (var(--parkspot-status-verified-bg), var(--parkspot-status-verified-text), var(--parkspot-status-verified-border)),
);

.rc-kyc {
    margin-top: 20px;
}

.rc-kyc-card {
    border: 1px solid var(--parkspot-border-grey);
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
    background: var(--parkspot-white);
    display: flex;
    align-items: center;
    justify-content: center;

    // Match the status-badge palette so the icon reflects the same state.
    @each $status, $colors in $status-colors {
        &.#{$status} {
            background: list.nth($colors, 1);
            :deep(i::before) {
                color: list.nth($colors, 2);
            }
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
    color: var(--parkspot-muted-grey);

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

    @each $status, $colors in $status-colors {
        &.#{$status} {
            background: list.nth($colors, 1);
            color: list.nth($colors, 2);
            border-color: list.nth($colors, 3);
        }
    }
}

.kyc-description {
    font-size: 14px;
    color: var(--parkspot-muted-grey);
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
