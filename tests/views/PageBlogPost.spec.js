import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createStore } from 'vuex';
import PageBlogPost from '@/views/PageBlogPost.vue';

let wrapper;
let routerPush;

const mockBlog = {
    id: 'test-blog',
    title: 'Test Blog',
    author: 'Test Author',
    img: '/assets/blog/test.jpg',
    desc: 'A short test description.',
    dateTime: '2025-01-15',
    time: 'Jan 15, 2025',
};

const store = createStore({
    modules: {
        blog: {
            namespaced: true,
            getters: {
                getBlogById: () => () => mockBlog,
            },
            actions: {
                p: vi.fn(() => Promise.resolve('Mock blog content')),
            },
        },
        user: {
            namespaced: true,
            actions: {
                onlyContact: vi.fn().mockResolvedValue(),
            },
        },
    },
});

const mountComponent = () => {
    routerPush = vi.fn();

    wrapper = mount(PageBlogPost, {
        global: {
            plugins: [store],
            stubs: {
                TemplateBlogPost: {
                    template: `
                        <div class="template-blog-post">
                            <span class="blog-title">{{ blog.title }}</span>
                            <span class="blog-content">{{ content }}</span>
                        </div>
                    `,
                    props: ['blog', 'content'],
                },
                PageContactUs: {
                    template: '<div class="page-contact-us"></div>',
                },
            },
            mocks: {
                $route: {
                    params: { id: 'test-blog' },
                },
                $router: {
                    push: routerPush,
                },
                $buefy: {
                    toast: {
                        open: vi.fn(),
                    },
                },
            },
        },
    });
};

describe('PageBlogPost.vue - Complete Test Suite', () => {
    beforeEach(() => {
        mountComponent();
    });

    afterEach(() => {
        wrapper?.unmount();
        vi.restoreAllMocks();
    });

    it('renders TemplateBlogPost and PageContactUs', async () => {
        await flushPromises();
        expect(wrapper.find('.template-blog-post').exists()).toBe(true);
        expect(wrapper.find('.page-contact-us').exists()).toBe(true);
    });

    it('fetches blog data using route param', () => {
        expect(wrapper.vm.blog).toEqual(mockBlog);
    });

    it('fetches blog content on mount', async () => {
        await flushPromises();
        expect(wrapper.find('.blog-content').text()).toBe('Mock blog content');
    });

    it('sets page title from the blog record (not the raw route param)', async () => {
        // After SSG migration, `mounted()` reads the human-readable
        // title from the blog Vuex module instead of using the slug.
        // The previous behaviour was a bug surfaced by the SSG
        // prerender — see ssg-research/04-integration-plan.md § 2.5.
        await flushPromises();
        expect(wrapper.vm.title).toBe('Test Blog');
    });

    it('fires contact action and navigates on success', async () => {
        await wrapper.vm.fireContact();
        expect(routerPush).toHaveBeenCalledWith({
            name: 'thankYou',
        });
    });
});
