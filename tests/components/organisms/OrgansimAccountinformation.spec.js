import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import OrganismAccountInformation from '@/components/organisms/OrganismAccountInformation.vue';
import { mayaClient } from '@/services/api';

vi.mock('@/services/api', () => ({
    mayaClient: {
        post: vi.fn(),
        patch: vi.fn(),
    },
}));

describe('OrganismAccountInformation.vue', () => {
    let wrapper;

    const apiPath = '/auth/user/account-information';

    const createWrapper = (props = {}) =>
        mount(OrganismAccountInformation, {
            props: {
                username: 'Dev',
                ...props,
            },
            global: {
                stubs: {
                    VeeForm: {
                        emits: ['submit', 'invalid-submit'],
                        template:
                            '<form @submit.prevent="$emit(\'submit\', { ...$parent.form })"><slot /></form>',
                    },
                    AtomButton: {
                        template:
                            '<button :type="nativeType" :disabled="disabled"><slot /></button>',
                        props: {
                            disabled: {
                                type: Boolean,
                                default: false,
                            },
                            nativeType: {
                                type: String,
                                default: 'button',
                            },
                        },
                    },
                },
            },
        });

    const remount = async (props = {}) => {
        wrapper?.unmount();
        wrapper = createWrapper(props);
        await flushPromises();
    };

    const setInputValue = async (name, value) => {
        await wrapper.find(`input[name="${name}"]`).setValue(value);
        await flushPromises();
    };

    const setMode = async (mode) => {
        await wrapper.find(`input[name="mode"][value="${mode}"]`).setValue();
        await flushPromises();
    };

    const setSelectValue = async (name, value) => {
        await wrapper.find(`select[name="${name}"]`).setValue(String(value));
        await flushPromises();
    };

    const submitForm = async () => {
        await wrapper.find('form').trigger('submit');
        await flushPromises();
    };

    const fillUpiForm = async () => {
        await setInputValue('fullName', 'Dev Kumar');
        await setMode('upi');
        await setInputValue('UpiID', 'dev@oksbi');
        await setSelectValue('PaymentApp', 1);
    };

    const fillMobileForm = async () => {
        await setInputValue('fullName', 'Dev Kumar');
        await setMode('mobile');
        await setInputValue('Mobile', '9876543210');
        await setSelectValue('PaymentApp', 2);
    };

    const fillBankForm = async () => {
        await setInputValue('fullName', 'Dev Kumar');
        await setMode('bank');
        await setInputValue('account_number', '123456789');
        await setInputValue('ifsc_code', 'SBIN0001234');
    };

    const createDeferred = () => {
        let resolve;
        let reject;

        const promise = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });

        return { promise, resolve, reject };
    };

    beforeEach(() => {
        vi.clearAllMocks();
        wrapper = createWrapper();
    });

    afterEach(() => {
        wrapper?.unmount();
    });

    it('renders the account information form', () => {
        expect(wrapper.find('form').exists()).toBe(true);
        expect(wrapper.find('h2').text()).toBe('Account Information');
    });

    it('submits a new UPI account with the full POST payload', async () => {
        mayaClient.post.mockResolvedValue({ ErrorCode: 0 });

        await fillUpiForm();

        await submitForm();

        expect(mayaClient.post).toHaveBeenCalledTimes(1);
        expect(mayaClient.post).toHaveBeenCalledWith(apiPath, {
            UserName: 'Dev',
            FullName: 'Dev Kumar',
            UpiID: 'dev@oksbi',
            PaymentApp: 1,
        });
        expect(mayaClient.patch).not.toHaveBeenCalled();
        expect(wrapper.emitted('saved')).toHaveLength(1);
        expect(wrapper.emitted('close')).toHaveLength(1);
    });

    it('updates an existing mobile account with the full PATCH payload', async () => {
        await remount({
            existingAccount: {
                AccountID: 10,
            },
        });
        mayaClient.patch.mockResolvedValue({ ErrorCode: 0 });

        await fillMobileForm();

        await submitForm();

        expect(mayaClient.patch).toHaveBeenCalledTimes(1);
        expect(mayaClient.patch).toHaveBeenCalledWith(apiPath, {
            UserName: 'Dev',
            FullName: 'Dev Kumar',
            Mobile: '9876543210',
            PaymentApp: 2,
        });
        expect(mayaClient.post).not.toHaveBeenCalled();
        expect(wrapper.emitted('saved')).toHaveLength(1);
        expect(wrapper.emitted('close')).toHaveLength(1);
    });

    it('submits a new bank account with the full POST payload', async () => {
        mayaClient.post.mockResolvedValue({ ErrorCode: 0 });

        await fillBankForm();

        await submitForm();

        expect(mayaClient.post).toHaveBeenCalledTimes(1);
        expect(mayaClient.post).toHaveBeenCalledWith(apiPath, {
            UserName: 'Dev',
            FullName: 'Dev Kumar',
            account_number: '123456789',
            ifsc_code: 'SBIN0001234',
            PaymentApp: 0,
        });
        expect(mayaClient.patch).not.toHaveBeenCalled();
        expect(wrapper.emitted('saved')).toHaveLength(1);
        expect(wrapper.emitted('close')).toHaveLength(1);
    });

    it('prefills UPI account data when an existing UPI account is passed', async () => {
        await remount({
            existingAccount: {
                FullName: 'Dev Kumar',
                UpiID: 'dev@oksbi',
                PaymentApp: 1,
            },
        });

        expect(wrapper.vm.form.mode).toBe('upi');
        expect(wrapper.vm.form.fullName).toBe('Dev Kumar');
        expect(wrapper.vm.form.UpiID).toBe('dev@oksbi');
        expect(wrapper.vm.form.PaymentApp).toBe(1);
        expect(
            wrapper.find('input[name="mode"][value="upi"]').element.checked,
        ).toBe(true);
        expect(wrapper.find('input[name="fullName"]').element.value).toBe(
            'Dev Kumar',
        );
        expect(wrapper.find('input[name="UpiID"]').element.value).toBe(
            'dev@oksbi',
        );
    });

    it('prefills mobile account data when an existing mobile account is passed', async () => {
        await remount({
            existingAccount: {
                FullName: 'Dev Kumar',
                Mobile: '9876543210',
                PaymentApp: 2,
            },
        });

        expect(wrapper.vm.form.mode).toBe('mobile');
        expect(wrapper.vm.form.fullName).toBe('Dev Kumar');
        expect(wrapper.vm.form.Mobile).toBe('9876543210');
        expect(wrapper.vm.form.PaymentApp).toBe(2);
        expect(
            wrapper.find('input[name="mode"][value="mobile"]').element.checked,
        ).toBe(true);
        expect(wrapper.find('input[name="fullName"]').element.value).toBe(
            'Dev Kumar',
        );
        expect(wrapper.find('input[name="Mobile"]').element.value).toBe(
            '9876543210',
        );
    });

    it('prefills bank account data when an existing bank account is passed', async () => {
        await remount({
            existingAccount: {
                FullName: 'Dev Kumar',
                account_number: '123456789',
                ifsc_code: 'SBIN0001234',
            },
        });

        expect(wrapper.vm.form.mode).toBe('bank');
        expect(wrapper.vm.form.fullName).toBe('Dev Kumar');
        expect(wrapper.vm.form.account_number).toBe('123456789');
        expect(wrapper.vm.form.ifsc_code).toBe('SBIN0001234');
        expect(
            wrapper.find('input[name="mode"][value="bank"]').element.checked,
        ).toBe(true);
        expect(wrapper.find('input[name="fullName"]').element.value).toBe(
            'Dev Kumar',
        );
        expect(wrapper.find('input[name="account_number"]').element.value).toBe(
            '123456789',
        );
        expect(wrapper.find('input[name="ifsc_code"]').element.value).toBe(
            'SBIN0001234',
        );
    });

    it('sets loading true before the API resolves and false after it resolves', async () => {
        const deferred = createDeferred();
        mayaClient.post.mockReturnValue(deferred.promise);
        await fillUpiForm();
        await submitForm();
        expect(wrapper.vm.loading).toBe(true);
        deferred.resolve({ ErrorCode: 0 });
        await flushPromises();
        expect(wrapper.vm.loading).toBe(false);
    });

    it('disables the submit button while loading is true', async () => {
        await wrapper.setData({ loading: true });
        await flushPromises();
        expect(
            wrapper.find('button[type="submit"]').attributes('disabled'),
        ).toBe('');
    });

    it('emits the business error display message when the API returns a business error', async () => {
        mayaClient.post.mockResolvedValue({
            ErrorCode: 2,
            DisplayMsg: 'Failed',
        });

        await fillUpiForm();
        await submitForm();
        expect(wrapper.emitted('error')).toEqual([['Failed']]);
        expect(wrapper.emitted('saved')).toBeUndefined();
        expect(wrapper.emitted('close')).toHaveLength(1);
        expect(wrapper.vm.loading).toBe(false);
    });

    it('emits the fallback business error message when DisplayMsg is missing', async () => {
        mayaClient.post.mockResolvedValue({
            ErrorCode: 2,
        });

        await fillUpiForm();
        await submitForm();
        expect(wrapper.emitted('error')).toEqual([
            ['Failed to save account information'],
        ]);
        expect(wrapper.emitted('saved')).toBeUndefined();
        expect(wrapper.emitted('close')).toHaveLength(1);
        expect(wrapper.vm.loading).toBe(false);
    });

    it('emits the rejected API error message when the request fails', async () => {
        mayaClient.post.mockRejectedValue({
            response: {
                data: {
                    DisplayMsg: 'API Error',
                },
            },
        });

        await fillUpiForm();
        await submitForm();
        expect(wrapper.emitted('error')).toEqual([['API Error']]);
        expect(wrapper.emitted('saved')).toBeUndefined();
        expect(wrapper.emitted('close')).toHaveLength(1);
        expect(wrapper.vm.loading).toBe(false);
    });

    it('closes the modal and resets loading when closeModal is triggered', async () => {
        await wrapper.setData({ loading: true });
        await flushPromises();
        await wrapper.find('.close').trigger('click');
        await flushPromises();
        expect(wrapper.vm.loading).toBe(false);
        expect(wrapper.emitted('close')).toHaveLength(1);
    });
});
