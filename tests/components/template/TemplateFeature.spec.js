import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TemplateFeature from '@/components/templates/TemplateFeature.vue';

const stubs = {
    BodyWrapper: {
        template: '<div class="body-wrapper"><slot /></div>',
    },
    MoleculeFeatureHeader: {
        template: '<div class="feature-header">Feature Header</div>',
    },
    MoleculeFeatureBody: {
        props: ['featuresTitle'],
        template: `
            <div class="feature-body">
                <h3 class="feature-title">{{ featuresTitle }}</h3>
                <div class="feature-slot">
                    <slot />
                </div>
            </div>
        `,
    },
};

const factory = () => {
    return mount(TemplateFeature, {
        global: {
            stubs,
        },
    });
};

describe('TemplateFeature.vue', () => {
    it('renders the component', () => {
        const wrapper = factory();
        expect(wrapper.exists()).toBe(true);
    });

    it('renders correct structure', () => {
        const wrapper = factory();

        expect(wrapper.find('.body-wrapper').exists()).toBe(true);
        expect(wrapper.find('.feature-header').exists()).toBe(true);
        expect(wrapper.findAll('.feature-body')).toHaveLength(4);
    });

    it('displays correct feature titles', () => {
        const wrapper = factory();

        const titles = wrapper.findAll('.feature-title').map((t) => t.text());

        expect(titles).toEqual([
            'Navigation',
            'Booking',
            'Searching',
            'Safety & Security',
        ]);
    });

    it('renders feature descriptions via slots', () => {
        const wrapper = factory();
        const text = wrapper.text();

        expect(text).toContain('hassle-free parking experience');
        expect(text).toContain('reserve a spot');
        expect(text).toContain('safe and secure parking area');
        expect(text).toContain('search apartment parking areas');
    });
});