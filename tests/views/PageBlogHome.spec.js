import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createStore } from 'vuex';
import PageBlogHome from '@/views/PageBlogHome.vue';

let wrapper;
let routerPush;

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
                getBlogById: () => (id) =>
                    mockBlogs.find((b) => b.id === id),
            },
        },
    },
});

const mountComponent = () => {
    routerPush = vi.fn();

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
                    push: routerPush,
                },
            },
        },
    });
};

describe('PageBlogHome.vue - Complete Test Suite', () => {
    beforeEach(() => {
        mountComponent();
    });

    afterEach(() => {
        wrapper?.unmount();
        vi.restoreAllMocks();
    });

    it('renders TemplateBlogHome', () => {
        expect(wrapper.find('.template-blog-home').exists()).toBe(true);
    });

    it('provides blogs data to the page', () => {
        expect(wrapper.vm.blogs).toEqual(mockBlogs);
    });

    it('navigates to mainBlog on blog click', async () => {
        await wrapper.find('.blog-click').trigger('click');
        expect(routerPush).toHaveBeenCalledWith({
            name: 'mainBlog',
            params: { id: 1 },
        });
    });
});
