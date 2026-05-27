// Phase 2.5b heading-hygiene follow-up (patch 0016).
//
// `OrganismContactUs` is the leaf that actually emits the heading
// element on the page. Pre-patch it always used <h1> (via AtomHeading's
// default level), so every page that embedded it (homepage, blog
// posts, /contact/) inherited a stray <h1>"Got a question?". Post-
// patch the level is a prop with default 'h2'; /contact/ opts back
// into 'h1' via the chain PageContactUs → TemplateContactUs → here.
//
// These tests pin the leaf-level contract. The template-level
// pass-through is covered in tests/components/template/TemplateContactUs.spec.js.
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { createStore } from 'vuex';
import OrganismContactUs from '@/components/organisms/OrganismContactUs.vue';

const buildStore = () =>
    createStore({
        modules: {
            config: {
                namespaced: true,
                state: () => ({
                    helplineNumber: '+91-9999999999',
                    helplineRef: 'tel:+919999999999',
                }),
            },
        },
    });

const stubs = {
    // AtomHeading honestly reflects the level prop so we can assert
    // it. If the prop doesn't reach the leaf, the tag falls back to
    // the marker tag below and the assertion fails loudly.
    AtomHeading: {
        props: ['level'],
        template: '<component :is="level || \'unset-heading-level\'"><slot /></component>',
    },
    AtomParagraph: { template: '<p><slot /></p>' },
    AtomIcon: { template: '<i></i>' },
};

const mountIt = (props = {}) =>
    mount(OrganismContactUs, {
        props,
        global: {
            plugins: [buildStore()],
            stubs,
        },
    });

describe('OrganismContactUs.vue — heading-level contract', () => {
    it('renders the headline as <h2> by default (section-embed safe)', () => {
        const w = mountIt();
        expect(w.findAll('h1').length).toBe(0);
        expect(w.findAll('h2').length).toBe(1);
        expect(w.find('h2').text()).toBe('Got a question?');
        w.unmount();
    });

    it('renders the headline as <h1> when headingLevel="h1" is passed', () => {
        const w = mountIt({ headingLevel: 'h1' });
        expect(w.findAll('h1').length).toBe(1);
        expect(w.findAll('h2').length).toBe(0);
        expect(w.find('h1').text()).toBe('Got a question?');
        w.unmount();
    });

    it('renders the headline at the requested level for h2..h6', () => {
        for (const lvl of ['h2', 'h3', 'h4', 'h5', 'h6']) {
            const w = mountIt({ headingLevel: lvl });
            expect(w.find(lvl).text()).toBe('Got a question?');
            w.unmount();
        }
    });

    it('validates the headingLevel prop (rejects non-heading tags)', () => {
        const validator =
            OrganismContactUs.props?.headingLevel?.validator ||
            OrganismContactUs.default?.props?.headingLevel?.validator;
        expect(validator).toBeTypeOf('function');
        expect(validator('h1')).toBe(true);
        expect(validator('h6')).toBe(true);
        expect(validator('h7')).toBe(false);
        expect(validator('div')).toBe(false);
        expect(validator('')).toBe(false);
    });
});
