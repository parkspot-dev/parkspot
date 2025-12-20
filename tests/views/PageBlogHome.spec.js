import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createStore } from 'vuex';
import PageBlogHome from '@/views/PageBlogHome.vue';

let wrapper;

const mockBlogs = [
    { id: 1, title: 'Test Blog 1' },
    { id: 2, title: 'Test Blog 2' },
];

const store = createStore({
    modules: {
        blog: {
            namespaced: true,
            getters: {
                getAllBlogs: () => mockBlogs,
                getBlogById: () => (id) => mockBlogs.find((b) => b.id === id),
            },
        },
    },
});

const mountComponent = () => {
    wrapper = mount(PageBlogHome, {
        global: {
            plugins: [store],
            stubs: {
                TemplateBlogHome: {
                    template: `
                        <div class="template-blog-home">
                            <button
                                class="blog-click"
                                @click="$emit('onBlogClick', 1)"
                            >
                                Open Blog
                            </button>
                        </div>
                    `,
                    props: ['blogs'],
                },
            },
            mocks: {
                $router: {
                    push: vi.fn(),
                },
            },
        },
    });

    return wrapper;
};

afterEach(() => {
    wrapper?.unmount();
});

describe('PageBlogHome.vue - Complete Test Suite', () => {
    it('renders TemplateBlogHome', () => {
        const wrapper = mountComponent();
        expect(wrapper.find('.template-blog-home').exists()).toBe(true);
    });

    it('provides blogs data to the page', () => {
        const wrapper = mountComponent();
        expect(wrapper.vm.blogs).toEqual(mockBlogs);
    });

    it('navigates to mainBlog on blog click', async () => {
        const wrapper = mountComponent();
        const router = wrapper.vm.$router;

        await wrapper.find('.blog-click').trigger('click');

        expect(router.push).toHaveBeenCalledWith({
            name: 'mainBlog',
            params: { id: 1 },
        });
    });
});
