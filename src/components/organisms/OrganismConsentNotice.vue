<template>
    <transition name="consent-slide">
        <div
            v-if="visible"
            class="consent-notice"
            role="region"
            aria-label="Cookie notice"
        >
            <p class="consent-notice__message">
                We use cookies to improve your experience and measure marketing
                performance. By continuing to use parkspot, you agree to our
                <router-link to="/privacy" class="consent-notice__link">
                    Privacy Policy</router-link
                >.
            </p>
            <button
                type="button"
                class="consent-notice__btn"
                aria-label="Acknowledge cookie notice"
                @click="acknowledge"
            >
                Got it
            </button>
        </div>
    </transition>
</template>

<script>
// PR-2 of conversion-tracking. Disclosure-only cookie notice.
//
// Per plan.md §2.8, parkspot's stance is disclosure (not opt-in): the
// Consent Mode v2 defaults are written as `granted` in index.html and
// this strip exists only to inform the visitor and capture an
// acknowledgement. Therefore:
//   - There is no Reject / Manage Preferences UI.
//   - Clicking "Got it" does NOT call gtag('consent', 'update', ...).
//   - Dismissal is persisted to localStorage so the strip stays
//     dismissed for 12 months. After expiry it re-shows so the
//     disclosure stays fresh.
//
// SSR-safety: this component is mounted under <ClientOnly> in App.vue,
// but we still guard localStorage access with try/catch because Safari
// private mode throws on read/write.

const STORAGE_KEY = 'parkspot_consent_notice';
// 12 months in milliseconds. Keeping this as a literal makes it easy
// to grep for and to bump in a future patch.
const TTL_MS = 365 * 24 * 60 * 60 * 1000;
// Mount-to-show delay (ms). Loose alignment with plan.md "slides up
// ~1s after page load".
const SHOW_DELAY_MS = 1000;

function readStoredAck() {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (
            !parsed ||
            typeof parsed !== 'object' ||
            parsed.acknowledged !== true ||
            typeof parsed.timestamp !== 'number'
        ) {
            return null;
        }
        return parsed;
    } catch () {
        // SecurityError in Safari private mode, JSON parse error from
        // hand-edited values, etc. Treat as "no record" — the worst
        // case is we re-show the strip, which is the safe default.
        return null;
    }
}

function isAckFresh(ack, now) {
    if (!ack) return false;
    return now - ack.timestamp < TTL_MS;
}

export default {
    name: 'OrganismConsentNotice',
    data() {
        return {
            visible: false,
            showTimer: null,
        };
    },
    mounted() {
        const now = Date.now();
        const ack = readStoredAck();
        if (isAckFresh(ack, now)) {
            return;
        }
        // Tiny delay so the strip slides in after first paint rather
        // than competing with above-the-fold content for attention.
        this.showTimer = window.setTimeout(() => {
            this.visible = true;
        }, SHOW_DELAY_MS);
    },
    beforeUnmount() {
        if (this.showTimer) {
            window.clearTimeout(this.showTimer);
            this.showTimer = null;
        }
    },
    methods: {
        acknowledge() {
            try {
                window.localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify({
                        acknowledged: true,
                        timestamp: Date.now(),
                    }),
                );
            } catch () {
                // Storage failure (private mode, quota, disabled
                // cookies) — strip will re-show next visit, which is
                // acceptable for a disclosure-only notice.
            }
            this.visible = false;
        },
    },
};
</script>

<style lang="scss" scoped>
.consent-notice {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    // Above page content but below modals (OrganismLogin uses
    // Buefy's modal which sits at z-index 40). Booking modals and
    // the chat widget take precedence over the strip.
    z-index: 30;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    min-height: 60px;
    padding: 0.75rem 1.5rem;
    background-color: rgba(255, 255, 255, 0.96);
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
    color: var(--parkspot-black, #222);
    font-size: 0.9rem;
    line-height: 1.4;
}

.consent-notice__message {
    margin: 0;
    flex: 1 1 auto;
    max-width: 70ch;
}

.consent-notice__link {
    color: var(--primary-color, #f5a623);
    text-decoration: underline;
}

.consent-notice__btn {
    flex: 0 0 auto;
    padding: 0.5rem 1.25rem;
    border: 0;
    border-radius: var(--border-default, 4px);
    background-color: var(--primary-color, #f5a623);
    color: #fff;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s ease;
}

.consent-notice__btn:hover,
.consent-notice__btn:focus {
    opacity: 0.9;
}

@media (max-width: 600px) {
    .consent-notice {
        flex-direction: column;
        gap: 0.75rem;
        min-height: 80px;
        padding: 1rem 1rem 1.25rem;
        text-align: center;
    }

    .consent-notice__btn {
        width: 100%;
        max-width: 320px;
    }
}

// Slide-up transition (~1s after mount, see SHOW_DELAY_MS).
.consent-slide-enter-active {
    transition:
        transform 0.4s ease-out,
        opacity 0.4s ease-out;
}

.consent-slide-enter-from {
    transform: translateY(100%);
    opacity: 0;
}

.consent-slide-leave-active {
    transition:
        transform 0.3s ease-in,
        opacity 0.3s ease-in;
}

.consent-slide-leave-to {
    transform: translateY(100%);
    opacity: 0;
}
</style>
