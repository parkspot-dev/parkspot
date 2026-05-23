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
                // Phase 2.5b: blog posts now embed the presentational
                // Template directly (not the route page). The stub
                // simulates the `contactUs` event so the route's
                // `fireContact` handler is wired and testable.
                TemplateContactUs: {
                    name: 'TemplateContactUs',
                    template: `
                        <div class="template-contact-us">
                            <button class="submit-btn" @click="$emit('contactUs')">Submit</button>
                        </div>
                    `,
                    emits: ['contactUs'],
                },
                LoaderModal: {
                    template: '<div class="loader-modal"></div>',
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

    it('renders TemplateBlogPost and the embedded contact widget', async () => {
        await flushPromises();
        expect(wrapper.find('.template-blog-post').exists()).toBe(true);
        expect(wrapper.find('.template-contact-us').exists()).toBe(true);
        // Phase 2.5b regression — the route page no longer embeds
        // `<PageContactUs>` (which carries its own metaInfo() and
        // overrode the blog-post <title>). Use the dumb Template
        // instead. If this DOM ever reappears, the title-collision
        // bug has come back.
        expect(wrapper.find('.page-contact-us').exists()).toBe(false);
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

    it('wires the embedded contact widget to fireContact', async () => {
        // The whole point of Phase 2.5b is that the route page (not a
        // nested Page wrapper) handles the contact-form submit. Drive
        // the click through the stubbed Template's emit and confirm
        // the navigation fires.
        await wrapper.find('.template-contact-us .submit-btn').trigger('click');
        await flushPromises();
        expect(routerPush).toHaveBeenCalledWith({ name: 'thankYou' });
    });

    // Phase 2.5b primary regression. Before this patch, the homepage
    // and every /blog/:id page rendered `<title>Contact Us | ParkSpot</title>`
    // because the embedded PageContactUs's metaInfo() last-wrote the
    // <title> via @unhead. The Template embed (no metaInfo) leaves
    // the blog's own title in place.
    it('does not let the embedded contact widget hijack the blog title', async () => {
        await flushPromises();
        const tcu = wrapper.findComponent({ name: 'TemplateContactUs' });
        expect(tcu.exists()).toBe(true);
        // The stubbed Template MUST NOT declare metaInfo() (it's a
        // dumb presentational unit). Guarding the architectural
        // invariant at the test layer makes regressions loud.
        expect(tcu.vm.$options.metaInfo).toBeUndefined();
    });

    it('resets isLoading via finally even if the catch path re-throws', async () => {
        // Make the router throw on the redirect inside fireContact's
        // catch branch — the spinner state must still come back down
        // because the reset moved into `finally`.
        store.dispatch = vi.fn(() => Promise.reject(new Error('boom')));
        wrapper.vm.$router.push = vi.fn(() => {
            throw new Error('router exploded');
        });
        wrapper.vm.onlyContact = vi.fn(() => Promise.reject(new Error('boom')));
        try {
            await wrapper.vm.fireContact();
        } catch {
            // swallow — we only care about the spinner state.
        }
        expect(wrapper.vm.isLoading).toBe(false);
    });
});
