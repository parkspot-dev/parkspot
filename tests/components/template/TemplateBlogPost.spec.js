import { mount } from '@vue/test-utils';
import { describe, it, expect, afterEach } from 'vitest';
import TemplateBlogPost from '@/components/templates/TemplateBlogPost.vue';

let wrapper;

const stubComponents = {
    HeaderBanner: {
        template: `
            <div class="header-banner">
                <h2 class="atom-heading">Test Blog Title</h2>
                <nav class="breadcrumb">
                    <span class="breadcrumb-item">Home</span>
                    <span class="breadcrumb-item">Blogs</span>
                </nav>
            </div>
        `,
    },
    AtomHeading: {
        template: "<h2 class='atom-heading'><slot /></h2>",
    },
    AtomParagraph: {
        template: "<p class='atom-paragraph'><slot /></p>",
    },
    AtomImage: {
        template: "<img class='atom-image' :src='src' :alt='alt' />",
        props: ['src', 'alt'],
    },
    BodyWrapper: {
        template: "<article class='body-wrapper article-wrapper'><slot /></article>",
    },
    'b-breadcrumb': {
        template: "<nav class='breadcrumb'><slot /></nav>",
    },
    'b-breadcrumb-item': {
        template: "<span class='breadcrumb-item'><slot /></span>",
    },
};

const mockBlog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    author_img: '/test.jpg',
    time: 'Jan 1, 2025',
    img: '/test-image.jpg',
};

const mountComponent = () => {
    wrapper = mount(TemplateBlogPost, {
        props: { blog: mockBlog },
        global: {
            stubs: stubComponents,
        },
    });

    return wrapper;
};

afterEach(() => {
    wrapper?.unmount();
});

describe('TemplateBlogPost.vue ,Complete Test Suite', () => {
    it('renders main layout components', () => {
        const wrapper = mountComponent();
        expect(wrapper.find('.header-banner').exists()).toBe(true);
        expect(wrapper.find('.article-wrapper').exists()).toBe(true);
        expect(wrapper.find('.atom-image').exists()).toBe(true);
        expect(wrapper.find('.custom-author').exists()).toBe(true);
    });

    it('renders blog title correctly', () => {
        const wrapper = mountComponent();
        expect(wrapper.find('.atom-heading').text()).toBe(mockBlog.title);
    });

    it('renders blog author correctly', () => {
        const wrapper = mountComponent();
        expect(wrapper.find('.atom-paragraph').text()).toBe(mockBlog.author);
    });

    it('passes image alt attribute correctly', () => {
        const wrapper = mountComponent();
        const img = wrapper.find('.atom-image');
        expect(img.attributes('alt')).toBe(mockBlog.title);
    });

    it('renders breadcrumb navigation items', () => {
        const wrapper = mountComponent();
        expect(wrapper.find('.breadcrumb').exists()).toBe(true);
        expect(wrapper.findAll('.breadcrumb-item').length).toBeGreaterThan(1);
    });

    it('matches snapshot for header banner content', () => {
        const wrapper = mountComponent();
        expect(wrapper.find('.header-banner').html()).toMatchSnapshot();
    });
});
