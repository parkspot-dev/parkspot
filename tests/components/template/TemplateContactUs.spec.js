import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import TemplateContactUs from '@/components/templates/TemplateContactUs.vue';

let wrapper;

// Phase 2.5b follow-up (patch 0016): the stub for OrganismContactUs
// reflects the headingLevel pass-through contract so we can assert
// the prop reaches the organism. Default 'h2'; PageContactUs opts
// /contact/ into 'h1'.
const stubs = {
    BodyWrapper: {
        template: '<div><slot /></div>',
    },
    OrganismContactUs: {
        name: 'OrganismContactUs',
        props: ['headingLevel'],
        template: '<div class="contact-us" :data-heading-level="headingLevel"></div>',
    },
    OrganismContactForm: {
        name: 'OrganismContactForm',
        props: ['textArea', 'formSubmitted'],
        template: `
            <button class="submit-btn" @click="$emit('submit-form')">
                Submit
            </button>
        `,
    },
};

describe('TemplateContactUs.vue', () => {
    beforeEach(() => {
        wrapper = mount(TemplateContactUs, {
            global: {
                stubs,
            },
        });
    });

    afterEach(() => {
        wrapper?.unmount();
    });

    it('renders contact us and contact form components', () => {
        expect(wrapper.find('.contact-us').exists()).toBe(true);
        expect(wrapper.find('.submit-btn').exists()).toBe(true);
    });

    it('passes correct props to OrganismContactForm', () => {
        const form = wrapper.findComponent({ name: 'OrganismContactForm' });

        expect(form.props('textArea')).toBe(true);
        expect(form.props('formSubmitted')).toBe(false);
    });

    it('emits contactUs event when form is submitted', async () => {
        await wrapper.find('.submit-btn').trigger('click');

        expect(wrapper.emitted('contactUs')).toBeTruthy();
        expect(wrapper.emitted('contactUs')).toHaveLength(1);
    });

    // Phase 2.5b heading-hygiene follow-up (patch 0016). The whole
    // point of the prop chain Page → Template → Organism is to keep
    // the section-embed default (h2) while letting /contact/ opt
    // back into h1. Pin both ends of the contract.
    describe('Phase 2.5b — headingLevel prop pass-through', () => {
        it('defaults headingLevel to "h2" when no prop is passed', () => {
            const cu = wrapper.findComponent({ name: 'OrganismContactUs' });
            expect(cu.props('headingLevel')).toBe('h2');
            expect(wrapper.find('.contact-us').attributes('data-heading-level')).toBe(
                'h2',
            );
        });

        it('forwards headingLevel="h1" to OrganismContactUs when overridden', () => {
            const w = mount(TemplateContactUs, {
                global: { stubs },
                props: { headingLevel: 'h1' },
            });
            const cu = w.findComponent({ name: 'OrganismContactUs' });
            expect(cu.props('headingLevel')).toBe('h1');
            expect(w.find('.contact-us').attributes('data-heading-level')).toBe(
                'h1',
            );
            w.unmount();
        });

        it('rejects invalid headingLevel values via prop validator', () => {
            const validator =
                TemplateContactUs.props?.headingLevel?.validator ||
                TemplateContactUs.default?.props?.headingLevel?.validator;
            expect(validator).toBeTypeOf('function');
            expect(validator('h1')).toBe(true);
            expect(validator('h6')).toBe(true);
            expect(validator('h7')).toBe(false);
            expect(validator('div')).toBe(false);
        });
    });
});
