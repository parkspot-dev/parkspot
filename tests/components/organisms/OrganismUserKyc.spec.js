import { mount, flushPromises } from '@vue/test-utils';
import { createStore } from 'vuex';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import OrganismUserKyc from '@/components/organisms/OrganismUserKyc.vue';
import identityKycModule from '@/store/identityKyc/index';
import { mayaClient } from '@/services/api';
import { KYCStatus } from '@/constant/enums';

vi.mock('@/services/api', () => ({
    mayaClient: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

const stubs = {
    'b-collapse': {
        props: ['modelValue'],
        template: `
            <div class="b-collapse-root">
                <slot name="trigger" :open="modelValue"></slot>
                <div class="card-content"><slot /></div>
            </div>
        `,
    },
    AtomIcon: { props: ['icon', 'size'], template: '<i></i>' },
    // vee-validate's `Form` component (imported here as `VeeForm`) is
    // registered internally under the name "Form" — vue-test-utils resolves
    // stubs by that internal name, not the local import alias.
    Form: {
        emits: ['submit'],
        template: `<form @submit.prevent="$emit('submit', { aadhaarNumber: $el.querySelector('input[name=aadhaarNumber]').value })"><slot /></form>`,
    },
};

describe('OrganismUserKyc.vue', () => {
    let wrapper;
    let store;

    const createWrapper = (userProfile = null) => {
        store = createStore({
            modules: {
                identityKyc: identityKycModule,
                user: {
                    namespaced: true,
                    state: () => ({ userProfile }),
                },
            },
        });

        return mount(OrganismUserKyc, {
            global: { plugins: [store], stubs },
        });
    };

    const aadhaarInput = () => wrapper.find('input[name="aadhaarNumber"]');

    const submitForm = async () => {
        await wrapper.find('form').trigger('submit');
        await flushPromises();
    };

    beforeEach(() => {
        vi.clearAllMocks();
        wrapper = createWrapper();
    });

    afterEach(() => {
        wrapper?.unmount();
        document.removeEventListener('visibilitychange', () => {});
    });

    it('shows the "Not verified" badge and the Aadhaar form by default', () => {
        expect(wrapper.find('.status-badge').text()).toBe('Not verified');
        expect(aadhaarInput().exists()).toBe(true);
        expect(wrapper.find('button[type="submit"]').text()).toContain('Get Verified');
    });

    it('groups the Aadhaar number into 4-4-4 as the user types', async () => {
        await aadhaarInput().setValue('123456789012');
        expect(aadhaarInput().element.value).toBe('1234 5678 9012');
    });

    it('initiates verification with digits-only Aadhaar and opens a new tab on submit', async () => {
        mayaClient.post.mockResolvedValue({
            VerificationID: 'V123',
            RedirectURL: 'https://cashfree.example/redirect',
            Status: 'Initiated',
        });
        const fakeWindow = { opener: 'something', location: { href: '' } };
        const openSpy = vi.spyOn(window, 'open').mockReturnValue(fakeWindow);

        await aadhaarInput().setValue('123456789012');
        await submitForm();

        expect(mayaClient.post).toHaveBeenCalledWith('/kyc/initiate', {
            IdNumber: '123456789012',
            IdType: 1,
        });
        expect(openSpy).toHaveBeenCalledWith('', '_blank');
        expect(fakeWindow.opener).toBe(null);
        expect(fakeWindow.location.href).toBe('https://cashfree.example/redirect');
        expect(wrapper.find('.status-badge').text()).toBe('Pending');
        expect(wrapper.find('button[type="submit"]').text()).toContain('Verifying');

        openSpy.mockRestore();
    });

    it('falls back to a same-tab redirect when the popup is blocked', async () => {
        mayaClient.post.mockResolvedValue({
            VerificationID: 'V123',
            RedirectURL: 'https://cashfree.example/redirect',
            Status: 'Initiated',
        });
        vi.spyOn(window, 'open').mockReturnValue(null);
        delete window.location;
        window.location = { href: '' };

        await aadhaarInput().setValue('123456789012');
        await submitForm();

        expect(window.location.href).toBe('https://cashfree.example/redirect');
    });

    it('shows the API error message and keeps the form visible when initiate fails', async () => {
        mayaClient.post.mockResolvedValue({ DisplayMsg: 'Invalid Aadhaar number' });
        vi.spyOn(window, 'open').mockReturnValue(null);
        delete window.location;
        window.location = { href: '' };

        await aadhaarInput().setValue('123456789012');
        await submitForm();

        expect(wrapper.find('.kyc-error').text()).toBe('Invalid Aadhaar number');
        expect(wrapper.find('.status-badge').text()).toBe('Failed');
        expect(wrapper.find('button[type="submit"]').text()).toContain('Retry Verification');
    });

    it('re-checks status when the tab becomes visible again while pending', async () => {
        mayaClient.post.mockResolvedValue({
            VerificationID: 'V123',
            RedirectURL: 'https://cashfree.example/redirect',
            Status: 'Initiated',
        });
        vi.spyOn(window, 'open').mockReturnValue({ opener: 'x', location: { href: '' } });
        mayaClient.get.mockResolvedValue({ Status: 'VERIFIED' });

        await aadhaarInput().setValue('123456789012');
        await submitForm();

        Object.defineProperty(document, 'visibilityState', {
            configurable: true,
            get: () => 'visible',
        });
        document.dispatchEvent(new Event('visibilitychange'));
        await flushPromises();

        expect(mayaClient.get).toHaveBeenCalledWith('/kyc/status?VerificationID=V123');
        expect(wrapper.find('.status-badge').text()).toBe('Verified');
    });

    it('locks the card and hides the form when the user profile is already ID-verified', () => {
        wrapper = createWrapper({ KYCStatus: KYCStatus.IDVerified });
        expect(wrapper.find('.status-badge').text()).toBe('Verified');
        expect(aadhaarInput().exists()).toBe(false);
    });

    it('locks the card when the user profile is fully verified', () => {
        wrapper = createWrapper({ KYCStatus: KYCStatus.Verified });
        expect(wrapper.find('.status-badge').text()).toBe('Verified');
        expect(aadhaarInput().exists()).toBe(false);
    });

    // Regression test for a manual-edit bug (operator-precedence: `a === b || c`
    // evaluated as `(a === b) || c`, which made isProfileVerified always true
    // regardless of the actual KYCStatus).
    it('does not lock the card for a KYCStatus other than IDVerified/Verified', () => {
        wrapper = createWrapper({ KYCStatus: KYCStatus.Pending });
        expect(wrapper.find('.status-badge').text()).toBe('Not verified');
        expect(aadhaarInput().exists()).toBe(true);
    });

    it('treats a user with no profile at all as not verified', () => {
        wrapper = createWrapper(null);
        expect(wrapper.find('.status-badge').text()).toBe('Not verified');
        expect(aadhaarInput().exists()).toBe(true);
    });
});
