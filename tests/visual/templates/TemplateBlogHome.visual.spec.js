import { describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-vue';
import TemplateBlogHome from '@/components/templates/TemplateBlogHome.vue';
import { renderOptions, tick } from '../test-helpers.js';

function mockBlog(i) {
    return {
        id: `blog-${i}`,
        title: `Blog post ${i}: Why monthly parking matters`,
        cover: `/assets/blog-cover-${(i % 3) + 1}.jpg`,
        author: 'ParkSpot Editorial',
        publishedAt: '2025-08-12',
        excerpt: 'A short description of why this post is worth reading. ' +
                 'It mentions verified parking, monthly rentals, and city coverage.',
    };
}

describe('visual / TemplateBlogHome', () => {
    test('empty list', async () => {
        const screen = render(TemplateBlogHome, {
            ...renderOptions(),
            props: { blogs: [] },
        });
        await tick();
        await expect.element(screen.baseElement)
            .toMatchScreenshot('TemplateBlogHome__empty');
    });

    test('three posts', async () => {
        const screen = render(TemplateBlogHome, {
            ...renderOptions(),
            props: { blogs: [mockBlog(1), mockBlog(2), mockBlog(3)] },
        });
        await tick();
        await expect.element(screen.baseElement)
            .toMatchScreenshot('TemplateBlogHome__three');
    });

    test('six posts — wraps to second row', async () => {
        const screen = render(TemplateBlogHome, {
            ...renderOptions(),
            props: { blogs: Array.from({ length: 6 }, (_, i) => mockBlog(i + 1)) },
        });
        await tick();
        await expect.element(screen.baseElement)
            .toMatchScreenshot('TemplateBlogHome__six');
    });
});
