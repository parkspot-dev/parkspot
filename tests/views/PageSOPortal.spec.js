import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import PageSOPortal from '@/views/PageSOPortal.vue';

vi.mock('@/services/ImageUploadService', () => ({
    default: {
        uploadImages: vi.fn(() => Promise.resolve({ success: false })),
    },
}));

const storeMock = {
    state: {
        user: {
            contactForm: {
                images: [],
                cno: '1234567890',
            },
        },
    },
    dispatch: vi.fn(),
};

const stubs = {
    TemplateSOPortal: {
        template: `
            <button class="template-submit" @click="$emit('final-submit')">
                Submit
            </button>
        `,
    },
    LoaderModal: {
        template: '<div class="loader-modal"></div>',
    },
};

const factory = () =>
    mount(PageSOPortal, {
        global: {
            stubs,
            mocks: {
                $store: storeMock,
                $router: {
                    push: vi.fn(),
                },
                $buefy: {
                    toast: {
                        open: vi.fn(),
                    },
                },
            },
        },
        data() {
            return {
                isLoading: false,
            };
        },
    });

describe('PageSOPortal.vue', () => {
    it('renders page component', () => {
        const wrapper = factory();
        expect(wrapper.exists()).toBe(true);
    });

    it('renders TemplateSOPortal', () => {
        const wrapper = factory();
        expect(wrapper.find('.template-submit').exists()).toBe(true);
    });

    it('calls onFinalSubmit when final-submit is emitted', async () => {
        const spy = vi.spyOn(PageSOPortal.methods, 'onFinalSubmit');
        const wrapper = factory();
        await wrapper.find('.template-submit').trigger('click');
        expect(spy).toHaveBeenCalled();
    });

});
