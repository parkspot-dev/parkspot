// Phase 2.5 heading-hygiene regression for TemplateHomeBanner.
//
// Pre-fix, the homepage banner shipped ZERO <h1> in the prerendered
// HTML — only <h2 class="title"> ("Search parking spot in seconds")
// inside the OrganismHomeCard. Every SEO audit tool flagged the
// missing landmark. The fix adds a single sr-only <h1> sourced from
// the centralised PAGE_H1.HOMEPAGE constant, which keeps the visual
// design intact (the card-stacked hero remains as-is) while making
// the heading hierarchy correct for crawlers and screen readers.
import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import TemplateHomeBanner from '@/components/templates/TemplateHomeBanner.vue';
import { PAGE_H1 } from '@/constant/constant';

const stubs = {
    BodyWrapper: { template: '<section><slot /></section>' },
    OrganismHomeCard: {
        template: '<div class="o-home-card"></div>',
        emits: ['changed'],
    },
};

describe('TemplateHomeBanner.vue — Phase 2.5 heading hygiene', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = mount(TemplateHomeBanner, { global: { stubs } });
    });
    afterEach(() => wrapper?.unmount());

    it('renders exactly one <h1>', () => {
        expect(wrapper.findAll('h1').length).toBe(1);
    });

    it('uses the PAGE_H1.HOMEPAGE constant for the H1 text', () => {
        expect(wrapper.find('h1').text()).toBe(PAGE_H1.HOMEPAGE);
    });

    // Phase 2.5c regression. H1 copy must:
    //   1. Stay under ~60ch so it doesn't wrap weirdly when made
    //      visible in a future redesign + stays scannable for
    //      screen readers (which announce the full string).
    //   2. Not claim geos ParkSpot doesn't actually serve. Earlier
    //      copy said "Across India"; the product is Bangalore /
    //      Hyderabad only. SEO copy must match reality.
    it('PAGE_H1.HOMEPAGE stays under ~60ch and reflects actual serviced geos', () => {
        expect(PAGE_H1.HOMEPAGE.length).toBeLessThanOrEqual(60);
        expect(PAGE_H1.HOMEPAGE).toMatch(/bangalore/i);
        expect(PAGE_H1.HOMEPAGE).toMatch(/hyderabad/i);
        // Aspirational copy that misled previous audits — must not
        // reappear unless / until ParkSpot launches additional geos.
        expect(PAGE_H1.HOMEPAGE).not.toMatch(/across india/i);
    });

    it('marks the H1 as sr-only so the hero design is unchanged', () => {
        // Design constraint: the visible card-stack layout has no
        // room for a prominent on-page headline. SEO + a11y both
        // accept an `.sr-only` H1 (it's in the DOM, parsed by
        // crawlers, announced by screen readers).
        const h1 = wrapper.find('h1');
        expect(h1.classes()).toContain('sr-only');
    });

    it('keeps the OrganismHomeCard mounted (visual hero intact)', () => {
        expect(wrapper.find('.o-home-card').exists()).toBe(true);
    });
});
