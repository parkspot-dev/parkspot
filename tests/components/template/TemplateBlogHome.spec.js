import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, afterEach } from 'vitest';
import TemplateBlogHome from '@/components/templates/TemplateBlogHome.vue';

let wrapper;

const stubComponents = {
    'HeaderBanner': {
        template: `
            <div class="header-banner-stub">
                <h1>Parking Blogs</h1>
            </div>
        `,
    },
    'BodyWrapper': {
        template: "<section class='body-wrapper'><slot /></section>",
    },
    'MoleculeBlogCard': {
        props: ['blog'],
        template: `
            <div
                class="molecule-blog-card"
                @click="$emit('onBtnClick', blog)"
            >
                <h3>{{ blog.title }}</h3>
                <p>{{ blog.excerpt }}</p>
            </div>
        `,
    },
    'b-breadcrumb': {
        template: "<nav class='breadcrumb'><slot /></nav>",
    },
    'b-breadcrumb-item': {
        template: "<span class='breadcrumb-item'><slot /></span>",
    },
};

const mockBlogs = [
    { id: 1, title: 'Blog 1', excerpt: 'Excerpt 1' },
    { id: 2, title: 'Blog 2', excerpt: 'Excerpt 2' },
];

const mountComponent = (blogs = mockBlogs) => {
    wrapper = mount(TemplateBlogHome, {
        props: { blogs },
        global: {
            stubs: {
                'router-link': true,
                ...stubComponents,
            },
            mocks: {
                $router: { push: vi.fn() },
            },
        },
    });

    return wrapper;
};

afterEach(() => {
    wrapper?.unmount();
});

describe('TemplateBlogHome.vue , Complete Test Suite', () => {
    it('renders main layout components', () => {
        const wrapper = mountComponent();
        expect(wrapper.find('.header-banner-stub').exists()).toBe(true);
        expect(wrapper.find('.body-wrapper').exists()).toBe(true);
        expect(wrapper.findAll('.molecule-blog-card').length).toBe(2);
    });

    it('renders blog titles correctly', () => {
        const wrapper = mountComponent();
        expect(wrapper.findAll('.molecule-blog-card')[0].text()).toContain(
            mockBlogs[0].title,
        );
    });

    it('emits blog click event', async () => {
        const wrapper = mountComponent();
        await wrapper.find('.molecule-blog-card').trigger('click');

        expect(wrapper.emitted('onBlogClick')).toBeTruthy();
    });

    it('handles empty blogs array', () => {
        const wrapper = mountComponent([]);
        expect(wrapper.findAll('.molecule-blog-card').length).toBe(0);
    });

    it('matches snapshot for blog home content', () => {
        const wrapper = mountComponent();
        expect(wrapper.find('.body-wrapper').text()).toMatchSnapshot();
    });
});
