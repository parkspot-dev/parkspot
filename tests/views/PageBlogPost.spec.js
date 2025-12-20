import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createStore } from 'vuex';
import PageBlogPost from '@/views/PageBlogPost.vue';

let wrapper;

const mockBlog = {
    id: 'test-blog',
    title: 'Test Blog',
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
                onlyContact: vi.fn(() => Promise.resolve()),
            },
        },
    },
});

const waitForAsync = async (wrapper) => {
    await Promise.resolve();
    await wrapper.vm.$nextTick();
};

const mountComponent = () => {
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
                    params: {
                        id: 'test-blog',
                    },
                },
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
    });

    return wrapper;
};

afterEach(() => {
    wrapper?.unmount();
});

describe('PageBlogPost.vue - Complete Test Suite', () => {
    it('renders TemplateBlogPost and PageContactUs', async () => {
        const wrapper = mountComponent();
        await waitForAsync(wrapper);
        expect(wrapper.find('.template-blog-post').exists()).toBe(true);
        expect(wrapper.find('.page-contact-us').exists()).toBe(true);
    });

    it('fetches blog data using route param', () => {
        const wrapper = mountComponent();
        expect(wrapper.vm.blog).toEqual(mockBlog);
    });

    it('fetches blog content on mount', async () => {
        const wrapper = mountComponent();
        await waitForAsync(wrapper);
        expect(wrapper.find('.blog-content').text()).toBe('Mock blog content');
    });

    it('sets page title from route param', async () => {
        const wrapper = mountComponent();
        await waitForAsync(wrapper);
        expect(wrapper.vm.title).toBe('test-blog');
    });

    it('fires contact action and navigates on success', async () => {
        const wrapper = mountComponent();
        const router = wrapper.vm.$router;
        await wrapper.vm.fireContact();
        expect(router.push).toHaveBeenCalledWith({ name: 'thankYou' });
    });
});
