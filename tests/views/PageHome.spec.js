import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createStore } from 'vuex';
import PageHome from '@/views/PageHome.vue';

describe('PageHome.vue', () => {
    let wrapper;
    let store;

    const onlyContact = vi.fn();
    const updateContact = vi.fn();
    const push = vi.fn();
    const toastOpen = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        store = createStore({
            modules: {
                user: {
                    namespaced: true,
                    actions: {
                        onlyContact,
                    },
                    mutations: {
                        'update-contact': updateContact,
                    },
                },
            },
        });

        wrapper = mount(PageHome, {
            global: {
                plugins: [store],
                mocks: {
                    $router: { push },
                    $buefy: {
                        toast: { open: toastOpen },
                    },
                },
                stubs: {
                    TemplateHomeBanner: true,
                    TemplateFeatureHome: true,
                    PageAbout: true,
                    PageContactUs: true,
                    TestimonialSection: true,
                    AtomIcon: true,
                    TemplateOurProducts: {
                        template: `<button data-testid="arrow" @click="$emit('arrow-btn')" />`,
                    },
                    VeeForm: {
                        template: `<form data-testid="form" @submit.prevent="$emit('submit')"><slot /></form>`,
                    },
                    FormInput: true,
                },
            },
        });
    });

    afterEach(() => {
        wrapper?.unmount();
    });

    it('renders car wash section', () => {
        expect(wrapper.find('#car-wash').exists()).toBe(true);
    });

    it('exposes page meta info', () => {
        const meta = wrapper.vm.$options.metaInfo();
        expect(meta).toBeTruthy();
        expect(meta.title).toBeDefined();
    });

    it('initializes form model', () => {
        expect(wrapper.vm.model).toBeDefined();
        expect(wrapper.vm.model.fullname).toBe('');
        expect(wrapper.vm.model.email).toBeUndefined();
    });

    it('navigates to contact page from products section', async () => {
        await wrapper.find('[data-testid="arrow"]').trigger('click');
        expect(push).toHaveBeenCalledWith({ name: 'contactUs' });
    });

    it('redirects via onArrowBtn method', () => {
        wrapper.vm.onArrowBtn();
        expect(push).toHaveBeenCalledWith({ name: 'contactUs' });
    });

    it('submits contact form successfully', async () => {
        wrapper.vm.model.fullname = 'Dev';
        wrapper.vm.model.email = 'dev@example.com';
        wrapper.vm.model.phone = '9999999999';
        wrapper.vm.model.message = 'Test message';
        onlyContact.mockResolvedValueOnce();
        await wrapper.find('[data-testid="form"]').trigger('submit');
        await flushPromises();
        expect(onlyContact).toHaveBeenCalled();
        expect(updateContact).toHaveBeenCalled();
        expect(push).toHaveBeenCalledWith({ name: 'thankYou' });
    });

    it('sets loading state during form submission', async () => {
        let resolvePromise;
        onlyContact.mockImplementationOnce(
            () =>
                new Promise((r) => {
                    resolvePromise = r;
                }),
        );

        wrapper.find('[data-testid="form"]').trigger('submit');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.isLoading).toBe(true);
        resolvePromise();
        await flushPromises();
        expect(wrapper.vm.isLoading).toBe(false);
    });

    it('handles contact form failure', async () => {
        wrapper.vm.model.fullname = 'Dev';
        wrapper.vm.model.email = 'dev@example.com';
        onlyContact.mockRejectedValueOnce(new Error('fail'));
        await wrapper.find('[data-testid="form"]').trigger('submit');
        await flushPromises();

        expect(toastOpen).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'is-danger',
                message: expect.any(String),
            }),
        );
        expect(push).toHaveBeenCalledWith({ name: 'Home' });
    });
});
