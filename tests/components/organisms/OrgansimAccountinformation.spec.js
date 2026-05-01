import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import OrganismAccountInformation from '@/components/organisms/OrganismAccountInformation.vue';
import { mayaClient } from '@/services/api';

vi.mock('@/services/api', () => ({
    mayaClient: {
        post: vi.fn(),
        patch: vi.fn(),
    },
}));

describe('Account Information Modal', () => {
    let wrapper;

    const mountComponent = (props = {}) => {
        return mount(OrganismAccountInformation, {
            props: {
                username: 'Dev',
                ...props,
            },
            global: {
                stubs: {
                    AtomButton: {
                        template:
                            '<button :disabled="disabled"><slot /></button>',
                        props: ['disabled'],
                    },
                    FormInput: true,
                    SelectInput: true,
                    VeeForm: {
                        template:
                            '<form @submit.prevent="submit"><slot /></form>',
                        methods: {
                            submit(e) {
                                e.preventDefault();
                                e.stopImmediatePropagation(); 

                                this.$emit('submit', {
                                    mode: 'upi',
                                    fullName: 'Dev',
                                    UpiID: 'dev@upi',
                                    PaymentApp: 1,
                                });
                            },
                        },
                    },
                    Field: true,
                },
            },
        });
    };

    beforeEach(() => {
        vi.clearAllMocks();
        wrapper = mountComponent();
    });

    afterEach(() => {
        wrapper?.unmount();
    });

    it('renders the account form when modal is opened', () => {
        expect(wrapper.find('form').exists()).toBe(true);
    });

    it('submits account details and emits success when API succeeds', async () => {
        mayaClient.post.mockResolvedValue({ ErrorCode: 0 });
        await wrapper.find('form').trigger('submit');
        await flushPromises();

        expect(mayaClient.post).toHaveBeenCalledWith(
            '/auth/user/account-information',
            expect.objectContaining({
                UserName: 'Dev',
                FullName: 'Dev',
            }),
        );

        expect(wrapper.emitted('saved')).toBeDefined();
        expect(wrapper.emitted('close')).toBeDefined();
    });

    it('shows error flow when API returns a business error', async () => {
        mayaClient.post.mockResolvedValue({
            ErrorCode: 2,
            DisplayMsg: 'Failed',
        });

        await wrapper.find('form').trigger('submit');
        await flushPromises();
        const errorEvents = wrapper.emitted('error');
        expect(errorEvents).toBeDefined();
        expect(errorEvents[0][0]).toBe('Failed');
        expect(wrapper.emitted('close')).toBeDefined();
    });

    it('handles API failure and emits error message', async () => {
        mayaClient.post.mockRejectedValue({
            response: { data: { DisplayMsg: 'API Error' } },
        });

        await wrapper.find('form').trigger('submit');
        await flushPromises();
        const errorEvents = wrapper.emitted('error');
        expect(errorEvents).toBeDefined();
        expect(errorEvents[0][0]).toBe('API Error');

        expect(wrapper.emitted('close')).toBeDefined();
    });

    it('updates existing account using PATCH when account already exists', async () => {
        wrapper.unmount();
        wrapper = mountComponent({
            existingAccount: { AccountID: 10 },
        });

        mayaClient.patch.mockResolvedValue({ ErrorCode: 0 });
        await wrapper.find('form').trigger('submit');
        await flushPromises();
        expect(mayaClient.patch).toHaveBeenCalledWith(
            '/auth/user/account-information',
            expect.any(Object),
        );

        expect(mayaClient.post).not.toHaveBeenCalled();
    });

    it('stops loading state after request completes', async () => {
        mayaClient.post.mockResolvedValue({ ErrorCode: 0 });
        await wrapper.find('form').trigger('submit');
        await flushPromises();
        expect(wrapper.vm.loading).toBe(false);
    });

    it('disables submit button while request is in progress', async () => {
        await wrapper.setData({ loading: true });
        const button = wrapper.find('button');
        expect(button.attributes('disabled')).toBeDefined();
    });
});
