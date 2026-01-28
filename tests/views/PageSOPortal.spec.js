import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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
        name: 'TemplateSOPortal',
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

const factory = (dataOverrides = {}) =>
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
                ...dataOverrides,
            };
        },
    });

describe('PageSOPortal.vue', () => {
    let wrapper;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        wrapper?.unmount();
    });

    it('renders page component', () => {
        wrapper = factory();
        expect(wrapper.exists()).toBe(true);
    });

    it('renders TemplateSOPortal', () => {
        wrapper = factory();
        expect(wrapper.findComponent({ name: 'TemplateSOPortal' }).exists()).toBe(true);
    });

    it('handles final-submit and shows error toast when image upload fails', async () => {
        wrapper = factory();

        await wrapper.find('.template-submit').trigger('click');

        expect(wrapper.vm.$buefy.toast.open).toHaveBeenCalled();
    });

    it('shows LoaderModal when isLoading is true', () => {
        wrapper = factory({ isLoading: true });

        expect(wrapper.find('.loader-modal').exists()).toBe(true);
    });
});
