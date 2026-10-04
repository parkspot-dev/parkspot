import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ImageUpload from '@/components/global/ImageUpload.vue';

vi.mock('@/services/ImageUploadService', () => ({
    default: {
        uploadImages: vi.fn(() => Promise.resolve({ success: false })),
    },
}));

describe('ImageUpload.vue', () => {
    let wrapper;

    const mountComponent = () =>
        mount(ImageUpload, {
            global: {
                stubs: {
                    AtomIcon: true,
                    LoaderModal: true,
                },
            },
        });

    afterEach(() => {
        wrapper?.unmount();
    });

    it('keeps the photo previews out of session replays', async () => {
        wrapper = mountComponent();
        await wrapper.setData({
            uploadImages: [{ file: {}, preview: 'data:image/png;base64,AAAA' }],
        });

        const preview = wrapper.find('.preview-img img');
        expect(preview.attributes('src')).toBe('data:image/png;base64,AAAA');
        // New Relic's session replay records nothing inside [data-nr-block].
        expect(preview.attributes()).toHaveProperty('data-nr-block');
    });
});
