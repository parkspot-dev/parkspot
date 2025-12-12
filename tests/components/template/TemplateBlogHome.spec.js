import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import TemplateBlogHome from '@/components/templates/TemplateBlogHome.vue';
const stubComponents = {
    'HeaderBanner': {
        template: '<div class="header-banner-stub"><slot /></div>',
    },
    'BodyWrapper': {
        template: "<section class='body-wrapper'><slot /></section>",
    },
    'MoleculeBlogCard': {
        props: ['blog'],
        template:
            '<div class="molecule-blog-card" @click="$emit(\'onBtnClick\', blog)"><h3>{{ blog.title }}</h3><p>{{ blog.excerpt }}</p></div>',
    },
    'b-breadcrumb': { template: '<ul class="b-breadcrumb"><slot /></ul>' },
    'b-breadcrumb-item': {
        template: '<li class="breadcrumb-item"><slot /></li>',
        props: ['tag', 'to', 'active', 'class'],
    },
};

describe('TemplateBlogHome.vue - Complete Test Suite', () => {
    const mockBlogs = [
        { id: 1, title: 'Blog 1', excerpt: 'Excerpt 1' },
        { id: 2, title: 'Blog 2', excerpt: 'Excerpt 2' },
    ];

    const mountComponent = (blogs = mockBlogs) =>
        mount(TemplateBlogHome, {
            props: { blogs: blogs },
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

    it('renders main components correctly', () => {
        const wrapper = mountComponent();
        expect(wrapper.find('.header-banner-stub').exists()).toBe(true);
        expect(wrapper.find('.body-wrapper').exists()).toBe(true);
        expect(wrapper.findAll('.molecule-blog-card').length).toBe(2);
    });

    it('renders blog titles and excerpts correctly', () => {
        const wrapper = mountComponent();
        const cards = wrapper.findAll('.molecule-blog-card');
        expect(cards[0].find('h3').text()).toBe('Blog 1');
        expect(cards[0].find('p').text()).toBe('Excerpt 1');
        expect(cards[1].find('h3').text()).toBe('Blog 2');
    });

    it('emits onBlogClick event with correct payload', async () => {
        const wrapper = mountComponent();
        await wrapper.find('.molecule-blog-card').trigger('click');

        expect(wrapper.emitted('onBlogClick')).toBeTruthy();
        expect(wrapper.emitted('onBlogClick')[0]).toEqual([mockBlogs[0]]);
    });

    it('renders breadcrumb navigation correctly', () => {
        const wrapper = mountComponent();
        const items = wrapper.findAll('.breadcrumb-item');
        expect(wrapper.find('.b-breadcrumb').exists()).toBe(true);
        expect(items.length).toBe(2);
        expect(items[0].text()).toContain('Home');
        expect(items[1].text()).toContain('Blogs');
    });

    it('handles empty blogs array gracefully', () => {
        const wrapper = mountComponent([]);
        expect(wrapper.findAll('.molecule-blog-card').length).toBe(0);
    });

    it('matches snapshot for complete blog list', () => {
        const wrapper = mountComponent();
        expect(wrapper.html()).toMatchSnapshot();
    });

    it('renders correct number of blog cards based on props', () => {
        const wrapper = mountComponent([
            { id: 1, title: 'Single Blog', excerpt: 'Single Excerpt' },
        ]);
        expect(wrapper.findAll('.molecule-blog-card').length).toBe(1);
    });
});
