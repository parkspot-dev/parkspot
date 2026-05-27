// Phase 2.5b regression suite for PageHome.
//
// The user-visible bug we're guarding against here is:
//   - Visiting `/` rendered `<title>Contact Us | ParkSpot</title>` in
//     the browser tab.
//
// Root cause: PageHome.vue embedded `<PageAbout>` and `<PageContactUs>`
// directly in its template. Each Page component declares its own
// `metaInfo()`, and the @unhead/vue mixin registers a useHead entry
// per declaration. @unhead resolves scalar fields (like <title>) with
// last-wins ordering, so the deepest / last-mounted Page's title
// silently clobbered the homepage's.
//
// Fix: embed `Template*` components (pure presentation, no metaInfo).
// These tests pin both ends of the contract:
//   1. The DOM shape — Templates are present; Page wrappers are not.
//   2. The metaInfo() output — PageHome contributes its own title.
//   3. The contact-form wiring — clicking inside TemplateContactUs
//      runs `fireContact` on PageHome (not a hidden parent).
import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createStore } from 'vuex';
import PageHome from '@/views/PageHome.vue';
import { PAGE_TITLE, PAGE_DESCRIPTION } from '@/constant/constant';

let wrapper;
let routerPush;

const buildStore = () =>
    createStore({
        modules: {
            user: {
                namespaced: true,
                mutations: {
                    'update-contact': vi.fn(),
                },
                actions: {
                    onlyContact: vi.fn().mockResolvedValue(),
                },
            },
        },
    });

const mountComponent = () => {
    routerPush = vi.fn();
    wrapper = mount(PageHome, {
        global: {
            plugins: [buildStore()],
            stubs: {
                TemplateHomeBanner: { template: '<div class="t-home-banner"></div>' },
                TemplateFeatureHome: { template: '<div class="t-feature-home"></div>' },
                TemplateOurProducts: { template: '<div class="t-our-products"></div>' },
                TestimonialSection: { template: '<div class="testimonials"></div>' },
                TemplateAbout: { template: '<div class="t-about"></div>' },
                TemplateContactUs: {
                    template: `
                        <div class="t-contact-us">
                            <button class="submit-btn" @click="$emit('contactUs')">Submit</button>
                        </div>
                    `,
                    emits: ['contactUs'],
                },
                LoaderModal: { template: '<div class="loader-modal"></div>' },
                // VeeForm + FormInput are unrelated to the regression
                // surface; stub them out so the mount stays cheap.
                VeeForm: { template: '<form><slot /></form>' },
                FormInput: { template: '<input />' },
                AtomIcon: { template: '<i></i>' },
            },
            mocks: {
                $route: { name: 'Home', fullPath: '/' },
                $router: { push: routerPush },
                $buefy: { toast: { open: vi.fn() } },
            },
        },
    });
};

describe('PageHome.vue — Phase 2.5b title-collision regression', () => {
    beforeEach(() => mountComponent());
    afterEach(() => {
        wrapper?.unmount();
        vi.restoreAllMocks();
    });

    it('embeds TemplateAbout and TemplateContactUs (not the Page wrappers)', () => {
        expect(wrapper.find('.t-about').exists()).toBe(true);
        expect(wrapper.find('.t-contact-us').exists()).toBe(true);
        // Architectural invariant — if these reappear, the title
        // collision bug has too.
        expect(wrapper.find('.page-about').exists()).toBe(false);
        expect(wrapper.find('.page-contact-us').exists()).toBe(false);
    });

    it("metaInfo() returns PageHome's own title (not any child's)", () => {
        const meta = wrapper.vm.$options.metaInfo.call(wrapper.vm);
        expect(meta.title).toBe(PAGE_TITLE.HOMEPAGE);
    });

    // Phase 2.5c regression. Before this patch the homepage <title>
    // was 155 chars of keyword-stuffing — well past Google's ~580px
    // SERP truncation and a strong title-rewrite signal. Pin the
    // length so the constant can't drift back to stuffed territory.
    // 60ch is the standard Google SERP cap; we allow up to that.
    it('PAGE_TITLE.HOMEPAGE is within Google\'s ~60-char SERP limit and not keyword-stuffed', () => {
        expect(PAGE_TITLE.HOMEPAGE.length).toBeLessThanOrEqual(60);
        expect(PAGE_TITLE.HOMEPAGE.length).toBeGreaterThanOrEqual(30);
        // Stuffing detector: no single token should repeat. Split on
        // word boundaries (lowercased), filter stop words and the
        // brand, and require unique tokens. If a future copy edit
        // duplicates "Parking" or "Bangalore" it trips here.
        const tokens = PAGE_TITLE.HOMEPAGE
            .toLowerCase()
            .split(/[^a-z]+/)
            .filter(
                (t) =>
                    t &&
                    !['in', 'and', 'the', 'of', 'a', 'parkspot'].includes(t),
            );
        const dupes = tokens.filter((t, i) => tokens.indexOf(t) !== i);
        expect(dupes).toEqual([]);
    });

    it('PAGE_DESCRIPTION.HOMEPAGE is within the SERP description range (150-160ch ideal)', () => {
        // Mobile SERPs cut at ~155ch; desktop at ~160ch. Allow 130-170
        // so editorial tweaks have room without breaking the test.
        expect(PAGE_DESCRIPTION.HOMEPAGE.length).toBeGreaterThanOrEqual(120);
        expect(PAGE_DESCRIPTION.HOMEPAGE.length).toBeLessThanOrEqual(170);
    });

    it('emits a route-specific meta description (no longer inherits the shell)', () => {
        const meta = wrapper.vm.$options.metaInfo.call(wrapper.vm);
        const desc = (meta.meta || []).find(
            (m) => m.name === 'description',
        );
        expect(desc).toBeDefined();
        expect(desc.content).toBe(PAGE_DESCRIPTION.HOMEPAGE);
    });

    it('emits og:title / og:description mirrors and a canonical link', () => {
        const meta = wrapper.vm.$options.metaInfo.call(wrapper.vm);
        const props = (meta.meta || []).reduce((acc, m) => {
            if (m.property) acc[m.property] = m.content;
            return acc;
        }, {});
        expect(props['og:title']).toBe(PAGE_TITLE.HOMEPAGE);
        expect(props['og:description']).toBe(PAGE_DESCRIPTION.HOMEPAGE);
        expect(props['og:type']).toBe('website');
        expect(props['og:url']).toBe('https://www.parkspot.in/');
        const canonical = (meta.link || []).find((l) => l.rel === 'canonical');
        expect(canonical).toBeDefined();
        expect(canonical.href).toBe('https://www.parkspot.in/');
    });

    it('routes the embedded contact widget to fireContact (Vuex + redirect)', async () => {
        await wrapper.find('.t-contact-us .submit-btn').trigger('click');
        await flushPromises();
        expect(routerPush).toHaveBeenCalledWith({ name: 'thankYou' });
    });

    it('resets isLoading via finally on the catch path', async () => {
        // Simulate a router blowup inside the catch branch; the
        // spinner state must still come back down.
        wrapper.vm.onlyContact = vi.fn(() => Promise.reject(new Error('boom')));
        wrapper.vm.$router.push = vi.fn(() => {
            throw new Error('router exploded');
        });
        try {
            await wrapper.vm.fireContact();
        } catch {
            // swallow.
        }
        expect(wrapper.vm.isLoading).toBe(false);
    });

    it('routes "arrow" CTA to the /contact route', async () => {
        wrapper.vm.onArrowBtn();
        expect(routerPush).toHaveBeenCalledWith({ name: 'contactUs' });
    });
});
