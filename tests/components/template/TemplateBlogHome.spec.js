import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TemplateBlogHome from '@/components/templates/TemplateBlogHome.vue';

const stubComponents = {
    HeaderBanner: {
        template: `
      <div class='header-banner'>
        <div class="blog-header">
          <h1>Parking Blogs</h1>
          <div class="blog-nav">
            <b-breadcrumb align="is-centered" size="is-small" class="b-breadcrumb">
              <b-breadcrumb-item tag="router-link" to="/" class="breadcrumb-item">Home</b-breadcrumb-item>
              <b-breadcrumb-item tag="router-link" to="/blog" active class="breadcrumb-item">Blogs</b-breadcrumb-item>
            </b-breadcrumb>
          </div>
        </div>
      </div>
    `,
    },
    BodyWrapper: {
        template: "<section class='body-wrapper'><slot /></section>",
    },
    MoleculeBlogCard: {
        props: ['blog'],
        template: `
      <div class='molecule-blog-card'>
        <h3>{{ blog.title }}</h3>
        <p>{{ blog.excerpt }}</p>
      </div>
    `,
    },
};

describe('TemplateBlogHome.vue - Complete Test Suite', () => {
    const mockBlogs = [
        { id: 1, title: 'Blog 1', excerpt: 'Excerpt 1' },
        { id: 2, title: 'Blog 2', excerpt: 'Excerpt 2' },
    ];

    const mountComponent = () =>
        mount(TemplateBlogHome, {
            props: { blogs: mockBlogs },
            global: { stubs: stubComponents },
        });

    it('renders main components correctly', () => {
        const wrapper = mountComponent();
        expect(wrapper.find('.header-banner').exists()).toBe(true);
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
        await wrapper.vm.onBlogClick(mockBlogs[0]);
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
        const wrapper = mount(TemplateBlogHome, {
            props: { blogs: [] },
            global: { stubs: stubComponents },
        });
        expect(wrapper.findAll('.molecule-blog-card').length).toBe(0);
    });

    it('matches snapshot for complete blog list', () => {
        const wrapper = mountComponent();
        expect(wrapper.html()).toMatchSnapshot();
    });

    it('renders correct number of blog cards based on props', () => {
        const wrapper = mount(TemplateBlogHome, {
            props: {
                blogs: [
                    { id: 1, title: 'Single Blog', excerpt: 'Single Excerpt' },
                ],
            },
            global: { stubs: stubComponents },
        });
        expect(wrapper.findAll('.molecule-blog-card').length).toBe(1);
    });
});
