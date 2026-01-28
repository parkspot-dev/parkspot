import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import TemplateContactUs from '@/components/templates/TemplateContactUs.vue';

let wrapper;

const stubs = {
    BodyWrapper: {
        template: '<div><slot /></div>',
    },
    OrganismContactUs: {
        template: '<div class="contact-us"></div>',
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
});
