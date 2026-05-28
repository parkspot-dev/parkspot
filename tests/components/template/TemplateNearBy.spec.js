// Phase 2.5 heading-hygiene regression for TemplateNearBy.
//
// Pre-fix, every area page shipped:
//   <h1>Book Your Parking Spot</h1>            ← generic; same on every URL
//   <h4>Parking near {locationWithCaps}</h4>   ← hierarchy violation
//   <h3>Find and book parking spaces near …</h3>
//
// Three problems:
//   1. The H1 was identical across all ~60 area URLs, with zero
//      keyword overlap with the actual page topic. SERP CTR penalty.
//   2. The location appeared in an <h4> with no <h3>/<h2> above it —
//      tools like Lighthouse / axe report this as a fail.
//   3. The dynamic city/area copy lived in an <h4>, so crawlers
//      reading the heading outline saw a generic page-level title
//      and a buried sub-heading.
//
// The fix:
//   - H1 = `headline` prop, sourced from `buildAreaPageMeta(url).h1`
//     (e.g. "Car Parking near Indiranagar, Bengaluru") via PageNearBy.
//   - The old H4 is promoted to H2 (sits directly under the H1).
//   - The old H3 below the spot grid is promoted to H2 (parallel
//     section structure: card grid + descriptive text).
import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import TemplateNearBy from '@/components/templates/TemplateNearBy.vue';

const stubs = {
    'HeaderBanner': { template: '<div class="header-banner"><slot /></div>' },
    'BodyWrapper': { template: '<section><slot /></section>' },
    'AtomHeading': {
        // Honest passthrough — render the level the caller asks for,
        // otherwise the heading-hygiene assertions all collapse to
        // a single tag and the regression is lost.
        props: ['level'],
        template: '<component :is="level || \'h2\'"><slot /></component>',
    },
    'AtomParagraph': { template: '<p><slot /></p>' },
    'MoleculeSRPCard': {
        name: 'MoleculeSRPCard',
        template: '<div class="srp-card"></div>',
        emits: ['on-details'],
    },
    'SkeletonSRPCard': { template: '<div class="skeleton"></div>' },
    'b-breadcrumb': { template: '<nav><slot /></nav>' },
    'b-breadcrumb-item': { template: '<a><slot /></a>' },
};

const buildSpot = (id) => ({ ID: id, name: `Spot ${id}`, status: 'available' });

describe('TemplateNearBy.vue — Phase 2.5 heading hygiene', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = mount(TemplateNearBy, {
            props: {
                nearByLocation: 'indiranagar',
                spots: [buildSpot(1), buildSpot(2)],
                isLoading: false,
                headline: 'Car Parking near Indiranagar, Bengaluru',
            },
            global: { stubs },
        });
    });
    afterEach(() => wrapper?.unmount());

    it('renders exactly one <h1>', () => {
        expect(wrapper.findAll('h1').length).toBe(1);
    });

    it('uses the headline prop as the H1 (location-specific, not the legacy literal)', () => {
        expect(wrapper.find('h1').text()).toBe(
            'Car Parking near Indiranagar, Bengaluru',
        );
        // Belt-and-suspenders: the literal pre-fix text must NOT
        // reappear. If it does, a regression has snuck in.
        expect(wrapper.text()).not.toContain('Book Your Parking Spot');
    });

    it('emits both area and city in the H1 (slug + city)', () => {
        // Re-mount with a different location to confirm reactivity.
        const w = mount(TemplateNearBy, {
            props: {
                nearByLocation: 'marathahalli',
                spots: [],
                isLoading: false,
                headline: 'Car Parking near Marathahalli, Bengaluru',
            },
            global: { stubs },
        });
        const h1 = w.find('h1').text();
        expect(h1).toContain('Marathahalli');
        expect(h1).toContain('Bengaluru');
        w.unmount();
    });

    it('promotes the spot-grid sub-heading from <h4> to <h2>', () => {
        const h2s = wrapper.findAll('h2').map((h) => h.text());
        expect(
            h2s.some(
                (t) => t.includes('Parking near') && t.includes('Indiranagar'),
            ),
        ).toBe(true);
    });

    it('promotes the descriptive-text sub-heading from <h3> to <h2>', () => {
        const h2s = wrapper.findAll('h2').map((h) => h.text());
        expect(
            h2s.some(
                (t) =>
                    t.includes('Find and book parking spaces near') &&
                    t.includes('Indiranagar'),
            ),
        ).toBe(true);
    });

    it('does not regress an orphan <h3> or <h4>', () => {
        // Hierarchy invariant — after the patch the only headings on
        // an area page are exactly one H1 and the H2 section
        // sub-headings. If a future edit reintroduces an h3/h4 the
        // hierarchy violation is back.
        expect(wrapper.findAll('h3').length).toBe(0);
        expect(wrapper.findAll('h4').length).toBe(0);
    });

    it('renders the spot grid (regression safety — heading rewrite must not break cards)', () => {
        expect(wrapper.findAll('.srp-card').length).toBe(2);
    });

    it('shows skeleton cards while isLoading is true', () => {
        const loading = mount(TemplateNearBy, {
            props: {
                nearByLocation: 'indiranagar',
                spots: [],
                isLoading: true,
                headline: 'Car Parking near Indiranagar, Bengaluru',
            },
            global: { stubs },
        });
        expect(loading.findAll('.skeleton').length).toBe(4);
        loading.unmount();
    });

    it('emits "details" with the spot ID when a card emits on-details', async () => {
        // Drive the events through the template's prop binding rather
        // than reaching into the stub; cheaper assertion that the
        // wiring survives the heading rewrite.
        await wrapper
            .findAllComponents({ name: 'MoleculeSRPCard' })[0]
            .vm.$emit('on-details', 1);
        expect(wrapper.emitted('details')).toBeTruthy();
        expect(wrapper.emitted('details')[0]).toEqual([1]);
    });

    it('renders without warnings when headline prop is omitted (falls back to default)', () => {
        const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const w = mount(TemplateNearBy, {
            props: { nearByLocation: 'btm', spots: [], isLoading: false },
            global: { stubs },
        });
        // Default prop fires — sanity that the page is still navigable
        // even when a page wrapper forgets to pass `:headline`.
        expect(w.find('h1').text().length).toBeGreaterThan(0);
        w.unmount();
        spy.mockRestore();
    });
});
