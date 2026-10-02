// Pins the Google sign-in failure contract in OrganismLogin.
//
// The bug: `loginWithGoogle` swallowed every failure (including the
// `signInWithPopup` rejection and the `getIdToken` timeout) and the component
// fired it without awaiting, so a failed or hung sign-in produced no feedback
// at all. The user just saw an inert modal.
//
// What we assert:
//   - A reported failure raises a danger toast.
//   - The user dismissing the Google popup is NOT treated as a failure.
//   - The button is disabled while the action is in flight (a second popup
//     would otherwise be opened, which fails with auth/popup-blocked).
//   - The button is re-enabled once the action settles either way.
//
// Uses a real namespaced Vuex store (matching the convention in the other
// component specs) because `mapActions` needs a real store to dispatch
// through; a `mocks.$store` stub is not enough.
import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createStore } from 'vuex';
import OrganismLogin from '@/components/organisms/OrganismLogin.vue';

const DANGER_TOAST = {
    message: 'Sign-in failed. Please check your connection and try again.',
    type: 'is-danger',
    duration: 4000,
};

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

const stubs = {
    'b-modal': { template: '<div><slot /></div>' },
    'AtomImage': { template: '<img />' },
};

const mountIt = (loginWithGoogle, toastOpen) => {
    const store = createStore({
        modules: {
            user: {
                namespaced: true,
                state: () => ({ loginModal: true }),
                mutations: {
                    'update-login-modal': (state, value) => {
                        state.loginModal = value;
                    },
                },
                actions: { loginWithGoogle },
            },
        },
    });

    const wrapper = mount(OrganismLogin, {
        global: {
            plugins: [store],
            mocks: { $buefy: { toast: { open: toastOpen } } },
            stubs,
        },
    });

    return { wrapper, store };
};

describe('OrganismLogin.vue - Google sign-in failure handling', () => {
    let toastOpen;

    beforeEach(() => {
        toastOpen = vi.fn();
    });

    it('raises a danger toast when the action reports a failure', async () => {
        const loginWithGoogle = vi.fn().mockResolvedValue({
            ok: false,
            code: 'auth/network-request-failed',
        });

        const { wrapper } = mountIt(loginWithGoogle, toastOpen);

        await wrapper.vm.login();

        expect(loginWithGoogle).toHaveBeenCalledTimes(1);
        expect(toastOpen).toHaveBeenCalledWith(DANGER_TOAST);
    });

    it('stays silent when the user closes the Google popup', async () => {
        const loginWithGoogle = vi.fn().mockResolvedValue({
            ok: false,
            code: 'auth/popup-closed-by-user',
        });

        const { wrapper } = mountIt(loginWithGoogle, toastOpen);

        await wrapper.vm.login();

        expect(toastOpen).not.toHaveBeenCalled();
    });

    it('stays silent when a second popup request is cancelled', async () => {
        const loginWithGoogle = vi.fn().mockResolvedValue({
            ok: false,
            code: 'auth/cancelled-popup-request',
        });

        const { wrapper } = mountIt(loginWithGoogle, toastOpen);

        await wrapper.vm.login();

        expect(toastOpen).not.toHaveBeenCalled();
    });

    it('raises no toast on success', async () => {
        const loginWithGoogle = vi.fn().mockResolvedValue({ ok: true });

        const { wrapper } = mountIt(loginWithGoogle, toastOpen);

        await wrapper.vm.login();

        expect(toastOpen).not.toHaveBeenCalled();
    });

    it('disables the button while the action is in flight', async () => {
        let resolveAction;
        const loginWithGoogle = vi.fn(
            () => new Promise((resolve) => (resolveAction = resolve)),
        );

        const { wrapper } = mountIt(loginWithGoogle, toastOpen);
        const button = wrapper.find('.google-btn');

        expect(button.attributes('disabled')).toBeUndefined();

        wrapper.vm.login();
        await flush();
        await wrapper.vm.$nextTick();

        expect(button.attributes('disabled')).toBeDefined();
        expect(button.text()).toContain('Signing in');

        resolveAction({ ok: true });
        await flush();
        await wrapper.vm.$nextTick();

        expect(button.attributes('disabled')).toBeUndefined();
        expect(button.text()).toContain('Sign in With Google');
    });

    it('ignores repeat clicks while a sign-in is already pending', async () => {
        let resolveAction;
        const loginWithGoogle = vi.fn(
            () => new Promise((resolve) => (resolveAction = resolve)),
        );

        const { wrapper } = mountIt(loginWithGoogle, toastOpen);

        wrapper.vm.login();
        await flush();
        wrapper.vm.login();
        await flush();

        expect(loginWithGoogle).toHaveBeenCalledTimes(1);

        resolveAction({ ok: true });
        await flush();
    });

    it('re-enables the button when the action rejects unexpectedly', async () => {
        // The action is contracted not to throw; if it ever does, the button
        // must not be left permanently disabled.
        const loginWithGoogle = vi.fn().mockRejectedValue(new Error('boom'));

        const { wrapper } = mountIt(loginWithGoogle, toastOpen);

        await wrapper.vm.login();

        expect(toastOpen).toHaveBeenCalledWith(DANGER_TOAST);
        expect(wrapper.vm.isLoading).toBe(false);
    });
});
