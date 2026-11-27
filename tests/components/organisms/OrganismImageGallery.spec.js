import { beforeEach, describe, expect, it, vi } from 'vitest';
import { reportError } from '@/telemetry';
import ImageGallery from '@/components/organisms/OrganismImageGallery.vue';

vi.mock('@/telemetry', () => ({
    reportError: vi.fn(),
}));

function galleryContext(images) {
    return {
        ...ImageGallery.data(),
        images,
        setImageSize: vi.fn(),
        $nextTick: vi.fn(),
    };
}

describe('OrganismImageGallery.vue image handling', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('drops invalid image values without changing delete indexes', () => {
        const ctx = galleryContext([null, 'a.jpg', '', undefined, 'b.jpg']);
        ImageGallery.methods.updateImages.call(ctx);

        expect(ctx.displayImages).toEqual(['a.jpg', 'b.jpg']);
        expect(ctx.imageIndexes).toEqual([1, 4]);

        const emit = vi.fn();
        ImageGallery.methods.removeImage.call(
            { imageIndexes: ctx.imageIndexes, $emit: emit },
            1,
        );
        expect(emit).toHaveBeenCalledWith('delete-image', 4);
    });

    it('reports invalid image URLs without sending the URL values', () => {
        const ctx = galleryContext([
            'https://example.com/good.jpg',
            'javascript:alert(1)?token=secret',
            null,
        ]);
        ImageGallery.methods.updateImages.call(ctx);

        expect(reportError).toHaveBeenCalledWith(
            expect.any(Error),
            expect.objectContaining({
                source: 'image_gallery',
                failure: 'invalid_image_url',
                invalid_image_count: 2,
                invalid_image_types: 'string,object',
            }),
        );
        expect(JSON.stringify(reportError.mock.calls)).not.toContain(
            'bad.example',
        );
        expect(JSON.stringify(reportError.mock.calls)).not.toContain('secret');
    });

    it('uses the default image when there are no valid images', () => {
        const ctx = galleryContext([null, '']);
        ImageGallery.methods.updateImages.call(ctx);

        expect(ctx.displayImages).toHaveLength(1);
        expect(ctx.imageIndexes).toEqual([]);
        expect(reportError).toHaveBeenCalledWith(
            expect.any(Error),
            expect.objectContaining({ failure: 'invalid_image_url' }),
        );
    });
});
